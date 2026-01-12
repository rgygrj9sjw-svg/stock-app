'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Chart from '../components/Chart'
import InfoPanel from '../components/InfoPanel'
import QuickStats from '../components/QuickStats'
import ScannerPanel from '../components/ScannerPanel'
import type { MarketstackEodEntry } from '../lib/marketstack'

export default function Home() {
  const [currentTicker, setCurrentTicker] = useState('AAPL')
  const [currentInterval, setCurrentInterval] = useState('1month')
  const [chartData, setChartData] = useState<MarketstackEodEntry[]>([])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentTicker={currentTicker} onTickerChange={setCurrentTicker} />

        <main className="flex-1 flex flex-col bg-runnr-dark overflow-y-auto">
          <Chart
            ticker={currentTicker}
            interval={currentInterval}
            onIntervalChange={setCurrentInterval}
            onDataUpdate={setChartData}
          />
          <QuickStats data={chartData} />
          <ScannerPanel onSelectTicker={setCurrentTicker} />
        </main>

        <InfoPanel ticker={currentTicker} data={chartData} />
      </div>
    </div>
  )
}
