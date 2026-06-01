import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bリーグ移籍トラッカー',
  description: 'Bリーグの移籍・退団・新加入情報をリアルタイムで追跡',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${geist.className} bg-gray-50 min-h-screen`}>
        <Navigation />
        <main className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="mt-12 border-t border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
            <p>Bリーグ移籍トラッカー — 各球団・Bリーグ公式の発表をもとに作成</p>
            <p className="mt-1">このサイトは非公式です。正確な情報は各球団の公式サイトをご確認ください。</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
