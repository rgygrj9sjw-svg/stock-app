'use client'

import { useEffect, useMemo, useState } from 'react'
import { fetchEodSeries, MarketstackEodEntry } from '../lib/marketstack'

const intervals = [
  { label: '1M', value: '1month', limit: 22 },
  { label: '3M', value: '3month', limit: 66 },
  { label: '6M', value: '6month', limit: 132 },
  { label: '1Y', value: '1year', limit: 260 },
]

type ChartProps = {
  ticker: string
  interval: string
  onIntervalChange: (interval: string) => void
  onDataUpdate: (data: MarketstackEodEntry[]) => void
}

const formatPrice = (value: number) => value.toFixed(2)

export default function Chart({ ticker, interval, onIntervalChange, onDataUpdate }: ChartProps) {
  const [data, setData] = useState<MarketstackEodEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activeInterval = intervals.find((item) => item.value === interval) ?? intervals[0]

  useEffect(() => {
    let isMounted = true
    const loadSeries = async () => {
      setLoading(true)
      setError(null)
      try {
        const series = await fetchEodSeries(ticker, activeInterval.limit)
        if (isMounted) {
          setData(series)
          onDataUpdate(series)
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load chart data')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadSeries()

    return () => {
      isMounted = false
    }
  }, [ticker, activeInterval.limit, onDataUpdate])

  const chartPoints = useMemo(() => {
    if (!data.length) {
      return ''
    }
    const closes = data.map((entry) => entry.close)
    const max = Math.max(...closes)
    const min = Math.min(...closes)
    const range = max - min || 1

    return data
      .map((entry, index) => {
        const x = (index / (data.length - 1)) * 100
        const y = 100 - ((entry.close - min) / range) * 100
        return `${x},${y}`
      })
      .join(' ')
  }, [data])

  const latest = data[data.length - 1]
  const previous = data[data.length - 2]
  const change = latest && previous ? latest.close - previous.close : 0
  const changePct = latest && previous ? (change / previous.close) * 100 : 0

  return (
    <section className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-runnr-muted">Live Chart</p>
          <div className="mt-2 flex items-end gap-4">
            <h1 className="text-3xl font-semibold text-white">{ticker}</h1>
            <div>
              <p className="text-xl font-semibold text-white">
                {latest ? formatPrice(latest.close) : '--'}
              </p>
              <p className={`text-sm ${change >= 0 ? 'text-up' : 'text-down'}`}>
                {change >= 0 ? '+' : ''}
                {changePct.toFixed(2)}% today
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {intervals.map((option) => (
            <button
              key={option.value}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                interval === option.value
                  ? 'bg-runnr-green text-black'
                  : 'bg-runnr-card text-white hover:bg-runnr-border'
              }`}
              onClick={() => onIntervalChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-6 h-[360px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-runnr-muted">
            Loading chart...
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-runnr-red">{error}</div>
        ) : data.length ? (
          <div className="relative h-full">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0">
              <defs>
                <linearGradient id="runnrGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline
                points={chartPoints}
                fill="none"
                stroke="#22c55e"
                strokeWidth="1.5"
              />
              <polygon points={`0,100 ${chartPoints} 100,100`} fill="url(#runnrGradient)" />
            </svg>
            <div className="absolute inset-0 flex items-end justify-between text-xs text-runnr-muted">
              <span>{data[0]?.date.split('T')[0]}</span>
              <span>{data[data.length - 1]?.date.split('T')[0]}</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-runnr-muted">
            No data available
          </div>
        )}
      </div>
    </section>
  )
}
