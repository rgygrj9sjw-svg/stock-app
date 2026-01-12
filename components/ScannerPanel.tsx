'use client'

import { useEffect, useMemo, useState } from 'react'
import { fetchEodSnapshot, MarketstackEodEntry } from '../lib/marketstack'

const SCAN_UNIVERSE = [
  'AAPL',
  'MSFT',
  'NVDA',
  'TSLA',
  'AMZN',
  'META',
  'AMD',
  'NFLX',
  'GOOGL',
  'AVGO',
  'ORCL',
  'CRM',
  'INTC',
  'SHOP',
  'UBER',
]

type ScannerPanelProps = {
  onSelectTicker: (ticker: string) => void
}

type ScannerRow = {
  symbol: string
  lastClose: number
  previousClose: number
  volume: number
  range: number
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)

export default function ScannerPanel({ onSelectTicker }: ScannerPanelProps) {
  const [snapshot, setSnapshot] = useState<MarketstackEodEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadScanner = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchEodSnapshot(SCAN_UNIVERSE)
        if (isMounted) {
          setSnapshot(data)
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load scanner data')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadScanner()

    return () => {
      isMounted = false
    }
  }, [])

  const rows = useMemo<ScannerRow[]>(() => {
    const grouped = snapshot.reduce<Record<string, MarketstackEodEntry[]>>((acc, entry) => {
      if (!acc[entry.symbol]) {
        acc[entry.symbol] = []
      }
      acc[entry.symbol].push(entry)
      return acc
    }, {})

    return SCAN_UNIVERSE.map((symbol) => {
      const entries = (grouped[symbol] ?? []).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      const last = entries[0]
      const previous = entries[1] ?? last
      return {
        symbol,
        lastClose: last?.close ?? 0,
        previousClose: previous?.close ?? 0,
        volume: last?.volume ?? 0,
        range: last ? last.high - last.low : 0,
      }
    })
  }, [snapshot])

  return (
    <section className="px-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-runnr-muted">Scanner</p>
          <h2 className="mt-2 text-lg font-semibold text-white">Momentum Radar</h2>
        </div>
        <button className="btn-secondary">Export CSV</button>
      </div>

      <div className="mt-4 card overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-runnr-muted">Loading scanner...</div>
        ) : error ? (
          <div className="p-6 text-sm text-runnr-red">{error}</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-runnr-card/60 text-runnr-muted">
              <tr>
                <th className="px-4 py-3 text-left">Symbol</th>
                <th className="px-4 py-3 text-right">Last</th>
                <th className="px-4 py-3 text-right">Change %</th>
                <th className="px-4 py-3 text-right">Range</th>
                <th className="px-4 py-3 text-right">Volume</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-runnr-border">
              {rows.map((row) => {
                const change = row.lastClose - row.previousClose
                const changePct = row.previousClose
                  ? (change / row.previousClose) * 100
                  : 0
                return (
                  <tr key={row.symbol} className="hover:bg-runnr-card/60">
                    <td className="px-4 py-3 font-semibold text-white">{row.symbol}</td>
                    <td className="px-4 py-3 text-right text-white">
                      {formatNumber(row.lastClose)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right ${
                        change >= 0 ? 'text-up' : 'text-down'
                      }`}
                    >
                      {change >= 0 ? '+' : ''}
                      {changePct.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right text-white">
                      {formatNumber(row.range)}
                    </td>
                    <td className="px-4 py-3 text-right text-white">
                      {formatNumber(row.volume)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="btn-ghost"
                        onClick={() => onSelectTicker(row.symbol)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )}
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
