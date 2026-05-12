import type { Metadata } from 'next'
import React from 'react'
import '../index.css'

export const metadata: Metadata = {
  title: 'FitBase',
  description: 'Exercise templates for FitBase users',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}
