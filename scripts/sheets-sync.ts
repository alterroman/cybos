/**
 * Google Sheets Lead Sync
 *
 * Syncs Serokell BD leads to a Google Sheets spreadsheet.
 * Uses Google Sheets API v4 with OAuth2 service account or API key.
 *
 * Usage:
 *   npx tsx scripts/sheets-sync.ts --sheet-id SHEET_ID --tab "Leads" --data '[...]'
 *   npx tsx scripts/sheets-sync.ts --sheet-id SHEET_ID --tab "Leads" --file leads.json
 *   npx tsx scripts/sheets-sync.ts --status  # Check config and sheet connection
 *
 * Setup:
 *   1. Create a Google Cloud project
 *   2. Enable Google Sheets API
 *   3. Create a Service Account and download credentials JSON
 *   4. Share the target spreadsheet with the service account email
 *   5. Set GOOGLE_SERVICE_ACCOUNT_KEY env var to the JSON content (or path to file)
 *      OR set GOOGLE_API_KEY for read-only public sheets (limited)
 *
 * Config in ~/.cybos/config.json:
 *   {
 *     "bd": {
 *       "serokell_leads_sheet_id": "1BxiMVs0...",
 *       "serokell_leads_tab": "Leads"
 *     }
 *   }
 */

import { readFileSync, existsSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import { resolve } from 'path'

// ===== TYPES =====

interface Lead {
  company: string
  website?: string
  hq?: string
  size?: string
  funding?: string
  stage?: string
  rust_evidence?: string
  domain?: string
  score: number
  tier: 'hot' | 'qualified' | 'watch'
  decision_maker?: string
  linkedin?: string
  github?: string
  outsource_signal?: string
  pitch_angle?: string
  research_date: string
  workspace?: string
  notes?: string
}

interface SheetConfig {
  sheetId: string
  tabName: string
}

// Column order in the spreadsheet
const COLUMNS = [
  'Score',
  'Tier',
  'Company',
  'Website',
  'HQ',
  'Size',
  'Funding Stage',
  'Funding Amount',
  'Domain',
  'Rust Evidence',
  'Decision Maker',
  'LinkedIn',
  'GitHub',
  'Outsource Signal',
  'Pitch Angle',
  'Research Date',
  'Notes',
  'Workspace Path',
]

const TIER_EMOJI: Record<string, string> = {
  hot: '🔥',
  qualified: '✅',
  watch: '🟡',
}

// ===== GOOGLE SHEETS API =====

async function getAccessToken(serviceAccountKey: object): Promise<string> {
  // JWT-based auth for service accounts
  // Using built-in Node.js crypto — no googleapis dependency needed
  const { createSign } = await import('crypto')

  const key = serviceAccountKey as Record<string, string>
  const now = Math.floor(Date.now() / 1000)
  const expiry = now + 3600

  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(
    JSON.stringify({
      iss: key['client_email'],
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: expiry,
    })
  ).toString('base64url')

  const signingInput = `${header}.${payload}`
  const sign = createSign('SHA256')
  sign.update(signingInput)
  const signature = sign.sign(key['private_key'], 'base64url')

  const jwt = `${signingInput}.${signature}`

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!tokenRes.ok) {
    const err = await tokenRes.text()
    throw new Error(`Failed to get access token: ${err}`)
  }

  const tokenData = (await tokenRes.json()) as { access_token: string }
  return tokenData.access_token
}

async function getSheetMetadata(sheetId: string, token: string): Promise<{ tabExists: boolean; nextRow: number }> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?includeGridData=false`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch sheet metadata: ${await res.text()}`)
  }

  const data = (await res.json()) as { sheets: Array<{ properties: { title: string } }> }
  const sheets = data.sheets || []
  const tabExists = sheets.some((s) => s.properties.title === 'Leads')

  // Get current row count in Leads tab
  if (tabExists) {
    const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Leads!A:A`
    const valuesRes = await fetch(valuesUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (valuesRes.ok) {
      const valuesData = (await valuesRes.json()) as { values?: string[][] }
      const rowCount = valuesData.values?.length ?? 0
      return { tabExists: true, nextRow: rowCount + 1 }
    }
  }

  return { tabExists, nextRow: 1 }
}

async function createLeadsTab(sheetId: string, token: string): Promise<void> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          addSheet: {
            properties: { title: 'Leads' },
          },
        },
      ],
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to create Leads tab: ${await res.text()}`)
  }
}

async function writeHeaders(sheetId: string, token: string): Promise<void> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Leads!A1:R1?valueInputOption=USER_ENTERED`
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [COLUMNS],
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to write headers: ${await res.text()}`)
  }
}

function leadToRow(lead: Lead): string[] {
  return [
    String(lead.score),
    `${TIER_EMOJI[lead.tier] || ''} ${lead.tier}`,
    lead.company,
    lead.website || '',
    lead.hq || '',
    lead.size || '',
    lead.stage || '',
    lead.funding || '',
    lead.domain || '',
    lead.rust_evidence || '',
    lead.decision_maker || '',
    lead.linkedin || '',
    lead.github || '',
    lead.outsource_signal || '',
    lead.pitch_angle || '',
    lead.research_date,
    lead.notes || '',
    lead.workspace || '',
  ]
}

async function appendLeads(sheetId: string, token: string, leads: Lead[], startRow: number): Promise<void> {
  const values = leads.map(leadToRow)
  const range = `Leads!A${startRow}:R${startRow + values.length - 1}`

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  })

  if (!res.ok) {
    throw new Error(`Failed to write leads: ${await res.text()}`)
  }
}

// ===== CONFIG =====

function loadConfig(): Record<string, unknown> {
  const configPath = resolve(homedir(), '.cybos', 'config.json')
  if (!existsSync(configPath)) return {}
  return JSON.parse(readFileSync(configPath, 'utf-8'))
}

function loadServiceAccount(): object | null {
  // Option 1: env var with JSON content
  const envJson = process.env['GOOGLE_SERVICE_ACCOUNT_KEY']
  if (envJson) {
    try {
      return JSON.parse(envJson)
    } catch {
      // might be a file path
    }

    if (existsSync(envJson)) {
      return JSON.parse(readFileSync(envJson, 'utf-8'))
    }
  }

  // Option 2: default file location
  const defaultPath = resolve(homedir(), '.cybos', 'google-service-account.json')
  if (existsSync(defaultPath)) {
    return JSON.parse(readFileSync(defaultPath, 'utf-8'))
  }

  return null
}

// ===== CLI =====

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {}
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]
    if (arg?.startsWith('--')) {
      const key = arg.slice(2)
      const value = argv[i + 1] && !argv[i + 1]!.startsWith('--') ? argv[++i] : 'true'
      args[key] = value!
    }
  }
  return args
}

async function checkStatus(sheetId: string): Promise<void> {
  const sa = loadServiceAccount()
  if (!sa) {
    console.log('❌ Google Service Account not configured')
    console.log('   Set GOOGLE_SERVICE_ACCOUNT_KEY env var or place credentials at:')
    console.log('   ~/.cybos/google-service-account.json')
    return
  }

  console.log('✅ Service account credentials found')

  try {
    const token = await getAccessToken(sa)
    console.log('✅ Successfully obtained access token')

    const { tabExists, nextRow } = await getSheetMetadata(sheetId, token)
    console.log(`✅ Connected to spreadsheet: ${sheetId}`)
    console.log(`   Leads tab: ${tabExists ? `exists (${nextRow - 1} rows)` : 'will be created on first sync'}`)
    console.log(`   Sheet URL: https://docs.google.com/spreadsheets/d/${sheetId}`)
  } catch (err) {
    console.log(`❌ Connection failed: ${(err as Error).message}`)
  }
}

async function main() {
  const args = parseArgs(process.argv)

  // Load config for defaults
  const config = loadConfig()
  const bdConfig = (config['bd'] as Record<string, string>) || {}

  const sheetId = args['sheet-id'] || bdConfig['serokell_leads_sheet_id']
  const tabName = args['tab'] || bdConfig['serokell_leads_tab'] || 'Leads'

  // Status check mode
  if (args['status'] === 'true') {
    if (!sheetId) {
      console.log('❌ No sheet ID configured.')
      console.log('   Add to ~/.cybos/config.json: { "bd": { "serokell_leads_sheet_id": "YOUR_ID" } }')
      console.log('   Or pass --sheet-id YOUR_ID')
      process.exit(1)
    }
    await checkStatus(sheetId)
    return
  }

  // Validate required args
  if (!sheetId) {
    console.error('❌ No Google Sheets ID provided.')
    console.error('   Use --sheet-id YOUR_ID or configure in ~/.cybos/config.json')
    console.error('   under: { "bd": { "serokell_leads_sheet_id": "YOUR_ID" } }')
    process.exit(1)
  }

  // Parse leads data
  let leads: Lead[]
  if (args['file']) {
    if (!existsSync(args['file'])) {
      console.error(`❌ File not found: ${args['file']}`)
      process.exit(1)
    }
    leads = JSON.parse(readFileSync(args['file'], 'utf-8'))
  } else if (args['data']) {
    leads = JSON.parse(args['data'])
  } else {
    console.error('❌ No data provided. Use --data \'[...]\' or --file leads.json')
    process.exit(1)
  }

  if (!Array.isArray(leads) || leads.length === 0) {
    console.error('❌ No leads to sync')
    process.exit(1)
  }

  console.log(`📊 Syncing ${leads.length} leads to Google Sheets...`)
  console.log(`   Sheet ID: ${sheetId}`)
  console.log(`   Tab: ${tabName}`)

  // Get service account credentials
  const sa = loadServiceAccount()
  if (!sa) {
    console.error('❌ Google Service Account not configured.')
    console.error('   Set GOOGLE_SERVICE_ACCOUNT_KEY env var to your service account JSON')
    console.error('   Or place credentials at: ~/.cybos/google-service-account.json')
    console.error('')
    console.error('📖 Setup guide:')
    console.error('   1. Go to https://console.cloud.google.com')
    console.error('   2. Create project → Enable Sheets API')
    console.error('   3. Create Service Account → Download JSON key')
    console.error('   4. Share your spreadsheet with the service account email')
    console.error('   5. Place key JSON at ~/.cybos/google-service-account.json')
    process.exit(1)
  }

  try {
    // Authenticate
    const token = await getAccessToken(sa)
    console.log('✅ Authenticated with Google')

    // Check/create tab
    const { tabExists, nextRow } = await getSheetMetadata(sheetId, token)

    if (!tabExists) {
      await createLeadsTab(sheetId, token)
      console.log('✅ Created Leads tab')
      await writeHeaders(sheetId, token)
      console.log('✅ Written column headers')
    }

    const writeRow = nextRow === 1 ? 2 : nextRow // Reserve row 1 for headers
    const isFirstWrite = nextRow <= 2

    if (isFirstWrite && tabExists) {
      // Tab exists but might be empty — ensure headers
      await writeHeaders(sheetId, token)
    }

    // Write leads
    await appendLeads(sheetId, token, leads, writeRow)

    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=0`
    console.log(`✅ Synced ${leads.length} leads to Google Sheets`)
    console.log(`   URL: ${sheetUrl}`)

    // Output URL for workflow to display
    console.log(`SHEETS_URL:${sheetUrl}`)
  } catch (err) {
    console.error(`❌ Sync failed: ${(err as Error).message}`)
    process.exit(1)
  }
}

main().catch(console.error)
