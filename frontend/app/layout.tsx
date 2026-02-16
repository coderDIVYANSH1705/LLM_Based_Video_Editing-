import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Reel Optimizer',
  description: 'Optimize your short-form videos with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-blue-50 via-white to-blue-100">{children}</body>
    </html>
  )
}
