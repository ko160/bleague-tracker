import Link from 'next/link'
import { getTransfers } from '@/lib/data'
import { TEAMS } from '@/lib/mockData'
import TransferCard from '@/components/TransferCard'
import { STATUS_LABEL, TransferStatus } from '@/types'

export const revalidate = 300 // 5分キャッシュ

export default async function HomePage() {
  const transfers = await getTransfers()
  const latest = transfers.slice(0, 3)
  const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })

  const counts = transfers.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl">🏀</span>
          <span className="text-sm opacity-80">{today} 更新</span>
        </div>
        <h1 className="text-2xl font-bold">Bリーグ 移籍トラッカー</h1>
        <p className="mt-1 opacity-90 text-sm">移籍・退団・新加入・継続情報をまとめてチェック</p>

        <div className="mt-4 grid grid-cols-4 gap-3">
          {(['transfer', 'new', 'departure', 'renewal'] as TransferStatus[]).map((s) => (
            <div key={s} className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{counts[s] || 0}</p>
              <p className="text-xs opacity-90">{STATUS_LABEL[s]}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">最新情報</h2>
          <Link href="/news" className="text-sm text-orange-500 hover:underline">すべて見る →</Link>
        </div>
        {latest.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((t) => <TransferCard key={t.id} transfer={t} />)}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">
            <p className="text-4xl mb-2">🏀</p>
            <p>まだ情報がありません</p>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">チームから探す</h2>
          <Link href="/teams" className="text-sm text-orange-500 hover:underline">すべて見る →</Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {TEAMS.map((team) => (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className="bg-white border border-gray-200 rounded-xl p-3 text-center hover:border-orange-300 hover:shadow-sm transition-all"
            >
              <div
                className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: team.color }}
              >
                {team.short_name.charAt(0)}
              </div>
              <p className="text-xs text-gray-700 font-medium leading-tight">{team.short_name}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
