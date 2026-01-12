export type MarketstackEodEntry = {
  symbol: string
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

type MarketstackResponse = {
  data: MarketstackEodEntry[]
}

const API_KEY = 'aa1f483db41baef4b6c7fc0397452b72'
const API_BASE = 'https://api.marketstack.com/v1'

const buildUrl = (endpoint: string, params: Record<string, string>) => {
  const url = new URL(`${API_BASE}${endpoint}`)
  url.searchParams.set('access_key', API_KEY)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url.toString()
}

export const fetchEodSeries = async (
  symbol: string,
  limit: number
): Promise<MarketstackEodEntry[]> => {
  const url = buildUrl('/eod', {
    symbols: symbol,
    limit: String(limit),
    sort: 'ASC',
  })
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch market data')
  }
  const payload = (await response.json()) as MarketstackResponse
  return payload.data ?? []
}

export const fetchEodSnapshot = async (
  symbols: string[],
  limit = 120
): Promise<MarketstackEodEntry[]> => {
  const url = buildUrl('/eod', {
    symbols: symbols.join(','),
    limit: String(limit),
    sort: 'DESC',
  })
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch market snapshot')
  }
  const payload = (await response.json()) as MarketstackResponse
  return payload.data ?? []
}
