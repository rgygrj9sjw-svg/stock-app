import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Runnr - Smart Trading Platform',
  description: 'Advanced stock analysis with ICT concepts, real-time charts, and AI assistance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-runnr-dark text-white antialiased">
        {children}
      </body>
    </html>
  )
}
