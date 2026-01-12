'use client'

import { MarketstackEodEntry } from '../lib/marketstack'

type QuickStatsProps = {
  data: MarketstackEodEntry[]
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)

export default function QuickStats({ data }: QuickStatsProps) {
  const latest = data[data.length - 1]
  const previous = data[data.length - 2]

  if (!latest) {
    return (
      <div className="px-6 pb-6 text-sm text-runnr-muted">Select a ticker to view stats.</div>
    )
  }

  const change = latest.close - (previous?.close ?? latest.close)
  const changePct = previous?.close ? (change / previous.close) * 100 : 0

  const stats = [
    { label: 'Open', value: formatNumber(latest.open) },
    { label: 'High', value: formatNumber(latest.high) },
    { label: 'Low', value: formatNumber(latest.low) },
    { label: 'Close', value: formatNumber(latest.close) },
    { label: 'Volume', value: formatNumber(latest.volume) },
    { label: 'Daily Change', value: `${change >= 0 ? '+' : ''}${changePct.toFixed(2)}%` },
  ]

  return (
    <section className="px-6 pb-6">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-xs uppercase text-runnr-muted">{stat.label}</p>
            <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
