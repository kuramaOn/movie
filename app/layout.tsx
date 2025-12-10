import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './enhanced-styles.css';
import Navigation from '@/components/Navigation'
import PWAInstaller from '@/components/PWAInstaller'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Network Chanel - Stream Movies & Documentaries',
  description: 'Watch the latest movies and documentaries on Network Chanel',
  manifest: '/manifest.json',
  themeColor: '#E50914',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Network Chanel',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-netflix-black text-white`}>
        <PWAInstaller />
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
