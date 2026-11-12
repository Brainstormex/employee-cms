import type { Metadata } from 'next'
import { DM_Sans, Instrument_Serif } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
})

const instrument = Instrument_Serif({
  variable: '--font-instrument',
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Employee CMS',
  description: 'Employee directory with search, pagination, and CRUD',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${instrument.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  )
}
