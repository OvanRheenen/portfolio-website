const API = 'https://api.vercel.com/v1/query/web-analytics/visits/aggregate'

export type DimensionRow = {
  key: string
  pageviews: number
  visitors: number
  share: number // % of section pageviews, 0–100
}

export type SeriesPoint = {
  timestamp: string
  pageviews: number
  visitors: number
}

export type AnalyticsResult = {
  range: { since: string; until: string }
  totals: { pageviews: number; visitors: number } | null
  timeseries: SeriesPoint[] | null
  byPath: DimensionRow[] | null
  byRoute: DimensionRow[] | null
  byReferrer: DimensionRow[] | null
  byCountry: DimensionRow[] | null
  byDevice: DimensionRow[] | null
  byBrowser: DimensionRow[] | null
  errors: string[]
  configError: string | null
}

function dateStr(d: Date): string {
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

// One aggregate query grouped by `by`. Returns raw rows or throws.
async function fetchAggregate(
  by: string,
  opts: {
    token: string
    projectId: string
    teamId?: string
    since: string
    until: string
    limit?: number
  },
): Promise<Record<string, unknown>[]> {
  const params = new URLSearchParams()
  if (opts.teamId) params.set('teamId', opts.teamId)
  params.set('projectId', opts.projectId)
  params.set('since', opts.since)
  params.set('until', opts.until)
  params.set('by', by)
  if (opts.limit) params.set('limit', String(opts.limit))

  const res = await fetch(`${API}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${opts.token}` },
    next: { revalidate: 300 },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`${by}: ${res.status} ${body.slice(0, 200)}`)
  }
  const json = (await res.json()) as { data: Record<string, unknown>[] }
  return json.data ?? []
}

function num(v: unknown): number {
  return typeof v === 'number' ? v : 0
}

export type Range = '24h' | '7d' | '30d'

export const RANGES: readonly Range[] = ['24h', '7d', '30d']

export const RANGE_LABEL: Record<Range, string> = {
  '24h': 'Last 24 hours',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
}

export function parseRange(v: unknown): Range {
  return typeof v === 'string' && (RANGES as readonly string[]).includes(v) ? (v as Range) : '30d'
}

const DAY_MS = 24 * 60 * 60 * 1000

export type ResolvedRange = {
  since: string // value sent to Vercel (date string or ms epoch)
  until: string
  granularity: string // 'hour' | 'day' | 'week'
  label: string // caption text
  active: Range | null // which preset to highlight; null when custom
  fromDate: string // YYYY-MM-DD to prefill the "from" input
  toDate: string // YYYY-MM-DD to prefill the "to" input
}

// Parse a YYYY-MM-DD string to a UTC-midnight Date, or null if malformed.
function parseDate(v: unknown): Date | null {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return null
  const d = new Date(`${v}T00:00:00.000Z`)
  return Number.isNaN(d.getTime()) ? null : d
}

// Caption for a custom window, e.g. "12 Jun 2026 – 25 Jun 2026".
function formatSpan(from: string, to: string): string {
  const opts: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }
  const f = new Date(`${from}T00:00:00.000Z`).toLocaleDateString('en-GB', opts)
  const t = new Date(`${to}T00:00:00.000Z`).toLocaleDateString('en-GB', opts)
  return `${f} – ${t}`
}

// Resolve preset range OR custom since/until into a Vercel query window.
// Custom wins when both dates are valid and since <= until; otherwise falls
// back to the preset (default 30d).
export function resolveRange(params: {
  range?: string
  since?: string
  until?: string
}): ResolvedRange {
  const now = Date.now()
  const today = dateStr(new Date(now))

  const from = parseDate(params.since)
  let to = parseDate(params.until)
  if (from && to) {
    if (to.getTime() > now) to = new Date(now) // clamp future until to today
    if (from.getTime() <= to.getTime()) {
      const fromDate = dateStr(from)
      const toDate = dateStr(to)
      const spanDays = (to.getTime() - from.getTime()) / DAY_MS
      const granularity = spanDays <= 2 ? 'hour' : spanDays <= 60 ? 'day' : 'week'
      return {
        since: fromDate,
        until: toDate,
        granularity,
        label: formatSpan(fromDate, toDate),
        active: null,
        fromDate,
        toDate,
      }
    }
  }

  const active = parseRange(params.range)
  if (active === '24h') {
    const fromDate = dateStr(new Date(now - DAY_MS))
    return {
      since: String(now - DAY_MS),
      until: String(now),
      granularity: 'hour',
      label: RANGE_LABEL[active],
      active,
      fromDate,
      toDate: today,
    }
  }
  const days = active === '7d' ? 7 : 30
  const sinceDate = dateStr(new Date(now - days * DAY_MS))
  return {
    since: sinceDate,
    until: today,
    granularity: 'day',
    label: RANGE_LABEL[active],
    active,
    fromDate: sinceDate,
    toDate: today,
  }
}

// Convert grouped rows into DimensionRow[], computing share of section pageviews.
function toRows(data: Record<string, unknown>[], by: string): DimensionRow[] {
  const total = data.reduce((s, r) => s + num(r.pageviews), 0)
  return data.map((r) => {
    const pageviews = num(r.pageviews)
    return {
      key: r[by] != null && r[by] !== '' ? String(r[by]) : 'Unknown',
      pageviews,
      visitors: num(r.visitors),
      share: total > 0 ? Math.round((pageviews / total) * 1000) / 10 : 0,
    }
  })
}

export async function getAnalytics(resolved: ResolvedRange): Promise<AnalyticsResult> {
  const token = process.env.VERCEL_ACCESS_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID
  const teamId = process.env.VERCEL_TEAM_ID || undefined

  const { since, until, granularity } = resolved

  const empty: AnalyticsResult = {
    range: { since, until },
    totals: null,
    timeseries: null,
    byPath: null,
    byRoute: null,
    byReferrer: null,
    byCountry: null,
    byDevice: null,
    byBrowser: null,
    errors: [],
    configError: null,
  }

  if (!token || !projectId) {
    return {
      ...empty,
      configError:
        'Missing VERCEL_ACCESS_TOKEN or VERCEL_PROJECT_ID. Set them in .env.local.',
    }
  }

  const base = { token, projectId, teamId, since, until }
  const errors: string[] = []

  // dimension key -> Vercel `by` value
  const dims: { field: keyof AnalyticsResult; by: string; limit: number }[] = [
    { field: 'byPath', by: 'requestPath', limit: 25 },
    { field: 'byRoute', by: 'route', limit: 25 },
    { field: 'byReferrer', by: 'referrerHostname', limit: 25 },
    { field: 'byCountry', by: 'country', limit: 25 },
    { field: 'byDevice', by: 'deviceType', limit: 25 },
    { field: 'byBrowser', by: 'browserName', limit: 25 },
  ]

  const result: AnalyticsResult = { ...empty, errors }
  const sink = result as Record<string, unknown> // for keyed dimension assignment

  // Timeseries (also used to compute period totals).
  const settledAll = await Promise.allSettled([
    fetchAggregate(granularity, base),
    ...dims.map((d) => fetchAggregate(d.by, { ...base, limit: d.limit })),
  ])
  const series = settledAll[0]
  const rest = settledAll.slice(1, 1 + dims.length)

  if (series.status === 'fulfilled') {
    const points: SeriesPoint[] = series.value.map((r) => ({
      timestamp: String(r.timestamp ?? ''),
      pageviews: num(r.pageviews),
      visitors: num(r.visitors),
    }))
    result.timeseries = points
    result.totals = points.reduce(
      (acc, p) => ({ pageviews: acc.pageviews + p.pageviews, visitors: acc.visitors + p.visitors }),
      { pageviews: 0, visitors: 0 },
    )
  } else {
    errors.push(String(series.reason))
  }

  rest.forEach((settled, i) => {
    const dim = dims[i]
    if (settled.status === 'fulfilled') {
      sink[dim.field] = toRows(settled.value, dim.by)
    } else {
      errors.push(String(settled.reason))
    }
  })

  return result
}
