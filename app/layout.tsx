import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#E50914" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Network Chanel" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${inter.className} bg-netflix-black text-white`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(registration => console.log('SW registered'))
                    .catch(err => console.log('SW registration failed'));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
