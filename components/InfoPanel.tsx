'use client'

import { MarketstackEodEntry } from '../lib/marketstack'

type InfoPanelProps = {
  ticker: string
  data: MarketstackEodEntry[]
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)

export default function InfoPanel({ ticker, data }: InfoPanelProps) {
  const latest = data[data.length - 1]
  const previous = data[data.length - 2]

  const change = latest && previous ? latest.close - previous.close : 0
  const changePct = latest && previous ? (change / previous.close) * 100 : 0
  const range = latest ? latest.high - latest.low : 0

  return (
    <aside className="w-80 bg-runnr-deep border-l border-runnr-border flex flex-col">
      <div className="p-6 border-b border-runnr-border">
        <h3 className="text-sm uppercase tracking-[0.2em] text-runnr-muted">Ticker intel</h3>
        <p className="mt-3 text-2xl font-semibold text-white">{ticker}</p>
        <p className={`text-sm ${change >= 0 ? 'text-up' : 'text-down'}`}>
          {change >= 0 ? '+' : ''}
          {changePct.toFixed(2)}% from prior close
        </p>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">
        <div className="card p-4">
          <p className="text-xs uppercase text-runnr-muted">Session overview</p>
          <div className="mt-3 space-y-2 text-sm text-white">
            <div className="flex items-center justify-between">
              <span className="text-runnr-muted">Close</span>
              <span>{latest ? formatNumber(latest.close) : '--'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-runnr-muted">Daily range</span>
              <span>{latest ? formatNumber(range) : '--'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-runnr-muted">Volume</span>
              <span>{latest ? formatNumber(latest.volume) : '--'}</span>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <p className="text-xs uppercase text-runnr-muted">Momentum signals</p>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-runnr-muted">Trend bias</span>
              <span className="text-white">{change >= 0 ? 'Bullish' : 'Bearish'}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-runnr-muted">Range expansion</span>
              <span className="text-white">{range > 0 ? 'Active' : 'Muted'}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-runnr-muted">Volume pressure</span>
              <span className="text-white">{latest?.volume ? 'Elevated' : 'Normal'}</span>
            </li>
          </ul>
        </div>

        <div className="card p-4">
          <p className="text-xs uppercase text-runnr-muted">Automation</p>
          <p className="mt-3 text-sm text-runnr-muted">
            Connect alerts, screeners, and CRM workflows to automate follow-ups from breakout
            signals.
          </p>
          <button className="btn-primary mt-4 w-full">Launch Workflow</button>
        </div>
      </div>
    </aside>
  )
}
