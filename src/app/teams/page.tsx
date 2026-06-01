import Link from 'next/link'
import { TEAMS } from '@/lib/mockData'
import { getTransfers } from '@/lib/data'

export const revalidate = 300

export default async function TeamsPage() {
  const transfers = await getTransfers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">チーム別</h1>
        <p className="text-sm text-gray-500 mt-1">チームを選んで移籍・退団情報を確認</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {TEAMS.map((team) => {
          const ins = transfers.filter(
            (t) => t.to_team === team.name && (t.status === 'new' || t.status === 'transfer')
          ).length
          const outs = transfers.filter(
            (t) => t.from_team === team.name || (t.to_team === null && t.status === 'departure')
          ).length
          const renewals = transfers.filter(
            (t) => t.to_team === team.name && t.status === 'renewal'
          ).length

          return (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-orange-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ backgroundColor: team.color }}
                >
                  {team.short_name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm leading-tight">{team.short_name}</p>
                  <p className="text-xs text-gray-400">{team.division}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 text-center text-xs">
                <div className="bg-green-50 rounded-lg py-1.5">
                  <p className="font-bold text-green-700">{ins}</p>
                  <p className="text-green-600">IN</p>
                </div>
                <div className="bg-red-50 rounded-lg py-1.5">
                  <p className="font-bold text-red-700">{outs}</p>
                  <p className="text-red-600">OUT</p>
                </div>
                <div className="bg-gray-50 rounded-lg py-1.5">
                  <p className="font-bold text-gray-600">{renewals}</p>
                  <p className="text-gray-500">継続</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
