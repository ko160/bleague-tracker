import { getTransfers } from '@/lib/data'
import { TEAMS } from '@/lib/mockData'
import PlayerTable from '@/components/PlayerTable'

export const dynamic = 'force-dynamic'

export default async function PlayersPage() {
  const transfers = await getTransfers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">選手一覧</h1>
        <p className="text-sm text-gray-500 mt-1">全選手の移籍・退団状況</p>
      </div>
      <PlayerTable transfers={transfers} teams={TEAMS} />
    </div>
  )
}
