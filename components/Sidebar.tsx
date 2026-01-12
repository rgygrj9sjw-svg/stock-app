'use client'

import { useEffect, useMemo, useState } from 'react'
import { fetchEodSnapshot, MarketstackEodEntry } from '../lib/marketstack'

const DEFAULT_WATCHLIST = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'META', 'AMD']

type WatchlistItem = {
  symbol: string
  lastClose: number
  previousClose: number
}

type SidebarProps = {
  currentTicker: string
  onTickerChange: (ticker: string) => void
}

const formatPrice = (value: number) => value.toFixed(2)

export default function Sidebar({ currentTicker, onTickerChange }: SidebarProps) {
  const [watchlist, setWatchlist] = useState(DEFAULT_WATCHLIST)
  const [snapshot, setSnapshot] = useState<MarketstackEodEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadSnapshot = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchEodSnapshot(watchlist)
        if (isMounted) {
          setSnapshot(data)
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load watchlist data')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    if (watchlist.length) {
      loadSnapshot()
    }

    return () => {
      isMounted = false
    }
  }, [watchlist])

  const watchlistItems = useMemo<WatchlistItem[]>(() => {
    const grouped = snapshot.reduce<Record<string, MarketstackEodEntry[]>>((acc, entry) => {
      if (!acc[entry.symbol]) {
        acc[entry.symbol] = []
      }
      acc[entry.symbol].push(entry)
      return acc
    }, {})

    return watchlist.map((symbol) => {
      const entries = (grouped[symbol] ?? []).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      const lastClose = entries[0]?.close ?? 0
      const previousClose = entries[1]?.close ?? lastClose
      return {
        symbol,
        lastClose,
        previousClose,
      }
    })
  }, [snapshot, watchlist])

  const handleAdd = () => {
    const symbol = inputValue.trim().toUpperCase()
    if (!symbol || watchlist.includes(symbol)) {
      setInputValue('')
      return
    }
    setWatchlist((prev) => [symbol, ...prev])
    setInputValue('')
  }

  return (
    <aside className="w-72 bg-runnr-deep border-r border-runnr-border flex flex-col">
      <div className="p-6 border-b border-runnr-border">
        <h2 className="text-sm uppercase tracking-[0.2em] text-runnr-muted">Watchlist</h2>
        <div className="mt-4 flex gap-2">
          <input
            className="input"
            placeholder="Add ticker"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          <button className="btn-secondary" onClick={handleAdd}>
            Add
          </button>
        </div>
        {error && <p className="mt-3 text-xs text-runnr-red">{error}</p>}
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-sm text-runnr-muted">Loading watchlist...</div>
        ) : (
          <ul className="divide-y divide-runnr-border">
            {watchlistItems.map((item) => {
              const change = item.lastClose - item.previousClose
              const changePct = item.previousClose
                ? (change / item.previousClose) * 100
                : 0
              const isActive = item.symbol === currentTicker
              return (
                <li
                  key={item.symbol}
                  className={`px-6 py-4 cursor-pointer transition-colors ${
                    isActive ? 'bg-runnr-card' : 'hover:bg-runnr-card/60'
                  }`}
                  onClick={() => onTickerChange(item.symbol)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.symbol}</p>
                      <p className="text-xs text-runnr-muted">Last close</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">
                        {formatPrice(item.lastClose)}
                      </p>
                      <p className={`text-xs ${change >= 0 ? 'text-up' : 'text-down'}`}>
                        {change >= 0 ? '+' : ''}
                        {changePct.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </li>
              )}
            )}
          </ul>
        )}
      </div>
    </aside>
  )
}
