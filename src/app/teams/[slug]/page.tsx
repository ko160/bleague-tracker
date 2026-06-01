import { notFound } from 'next/navigation'
import { TEAMS } from '@/lib/mockData'
import { getTransfers } from '@/lib/data'
import TransferCard from '@/components/TransferCard'
import Link from 'next/link'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export default async function TeamPage({ params }: Props) {
  const { slug } = await params
  const team = TEAMS.find((t) => t.id === slug)
  if (!team) notFound()

  const transfers = await getTransfers()

  const ins = transfers.filter(
    (t) => t.to_team === team.name && (t.status === 'new' || t.status === 'transfer')
  )
  const outs = transfers.filter(
    (t) => t.from_team === team.name && t.status === 'transfer'
  ).concat(
    transfers.filter((t) => t.to_team === null && t.status === 'departure' && t.from_team === team.name)
  )
  const renewals = transfers.filter(
    (t) => t.to_team === team.name && t.status === 'renewal'
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/teams" className="hover:text-orange-500">チーム一覧</Link>
        <span>/</span>
        <span className="text-gray-700">{team.name}</span>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl"
          style={{ backgroundColor: team.color }}
        >
          {team.short_name.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
          <p className="text-sm text-gray-400">{team.division}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 text-center">
        <div className="bg-green-50 border border-green-100 rounded-xl p-3">
          <p className="text-2xl font-bold text-green-700">{ins.length}</p>
          <p className="text-sm text-green-600">IN（加入・移籍）</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-3">
          <p className="text-2xl font-bold text-red-700">{outs.length}</p>
          <p className="text-sm text-red-600">OUT（退団・移籍）</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
          <p className="text-2xl font-bold text-gray-600">{renewals.length}</p>
          <p className="text-sm text-gray-500">継続</p>
        </div>
      </div>

      {ins.length > 0 && (
        <section>
          <h2 className="font-bold text-gray-900 mb-3">✅ IN（加入・移籍）</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {ins.map((t) => <TransferCard key={t.id} transfer={t} />)}
          </div>
        </section>
      )}
      {outs.length > 0 && (
        <section>
          <h2 className="font-bold text-gray-900 mb-3">👋 OUT（退団・移籍）</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {outs.map((t) => <TransferCard key={t.id} transfer={t} />)}
          </div>
        </section>
      )}
      {renewals.length > 0 && (
        <section>
          <h2 className="font-bold text-gray-900 mb-3">🔒 継続</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {renewals.map((t) => <TransferCard key={t.id} transfer={t} />)}
          </div>
        </section>
      )}
      {ins.length === 0 && outs.length === 0 && renewals.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-2">🏀</p>
          <p>まだ情報がありません</p>
        </div>
      )}
    </div>
  )
}
