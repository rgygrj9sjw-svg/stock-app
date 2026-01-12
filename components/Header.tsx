'use client'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-runnr-border bg-runnr-deep">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-runnr-green/20 text-runnr-green flex items-center justify-center font-semibold">
          R
        </div>
        <div>
          <p className="text-lg font-semibold text-white">Runnr</p>
          <p className="text-xs text-runnr-muted">Master Stock Trading Scanner</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-runnr-card border border-runnr-border rounded-lg">
          <span className="h-2 w-2 rounded-full bg-runnr-green animate-pulse-slow" />
          <span className="text-xs text-runnr-muted">Marketstack Live Data</span>
        </div>
        <button className="btn-secondary">Upgrade</button>
        <button className="btn-primary">New Scan</button>
      </div>
    </header>
  )
}
