'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Chart from '@/components/Chart'
import InfoPanel from '@/components/InfoPanel'
import QuickStats from '@/components/QuickStats'

export default function Home() {
  const [currentTicker, setCurrentTicker] = useState('AAPL')
  const [currentInterval, setCurrentInterval] = useState('1day')
  const [chartData, setChartData] = useState<any[]>([])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Watchlist */}
        <Sidebar 
          currentTicker={currentTicker}
          onTickerChange={setCurrentTicker}
        />
        
        {/* Main Chart Area */}
        <main className="flex-1 flex flex-col bg-runnr-dark overflow-hidden">
          <Chart 
            ticker={currentTicker}
            interval={currentInterval}
            onIntervalChange={setCurrentInterval}
            onDataUpdate={setChartData}
          />
          <QuickStats data={chartData} />
        </main>
        
        {/* Right Sidebar - Info */}
        <InfoPanel 
          ticker={currentTicker}
          data={chartData}
        />
      </div>
    </div>
  )
}
