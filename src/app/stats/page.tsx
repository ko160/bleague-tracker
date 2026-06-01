import { getTransfers } from '@/lib/data'
import { TEAMS } from '@/lib/mockData'
import { STATUS_LABEL, STATUS_ICON, TransferStatus } from '@/types'

export const revalidate = 3600

export default async function StatsPage() {
  const transfers = await getTransfers()
  const total = transfers.length

  const byStatus = (['transfer', 'new', 'departure', 'renewal'] as TransferStatus[]).map((s) => ({
    status: s,
    count: transfers.filter((t) => t.status === s).length,
  }))

  const teamStats = TEAMS.map((team) => {
    const ins = transfers.filter(
      (t) => t.to_team === team.name && (t.status === 'new' || t.status === 'transfer')
    ).length
    const outs = transfers.filter((t) => t.from_team === team.name).length
    return { team, ins, outs, net: ins - outs }
  }).filter((s) => s.ins + s.outs > 0)

  const mostIn = [...teamStats].sort((a, b) => b.ins - a.ins)[0]
  const mostOut = [...teamStats].sort((a, b) => b.outs - a.outs)[0]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">統計・サマリー</h1>
        <p className="text-sm text-gray-500 mt-1">2025-26シーズン オフシーズン動向</p>
      </div>

      <section className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
        <p className="text-sm opacity-80 mb-1">シーズン累計</p>
        <p className="text-5xl font-bold">{total}<span className="text-xl ml-1 opacity-80">件</span></p>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {byStatus.map(({ status, count }) => (
            <div key={status} className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs opacity-90">{STATUS_ICON[status]} {STATUS_LABEL[status]}</p>
            </div>
          ))}
        </div>
      </section>

      {(mostIn || mostOut) && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">注目チーム</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {mostIn && (
              <div className="bg-white border border-green-200 rounded-xl p-4">
                <p className="text-xs text-green-600 font-medium mb-1">最も補強したチーム</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: mostIn.team.color }}>
                    {mostIn.team.short_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{mostIn.team.short_name}</p>
                    <p className="text-sm text-gray-500">{mostIn.ins}名 IN</p>
                  </div>
                </div>
              </div>
            )}
            {mostOut && (
              <div className="bg-white border border-red-200 rounded-xl p-4">
                <p className="text-xs text-red-600 font-medium mb-1">最も選手が出たチーム</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: mostOut.team.color }}>
                    {mostOut.team.short_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{mostOut.team.short_name}</p>
                    <p className="text-sm text-gray-500">{mostOut.outs}名 OUT</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {teamStats.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">チーム別IN/OUT</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">チーム</th>
                    <th className="text-center px-4 py-3 font-medium text-green-600">IN</th>
                    <th className="text-center px-4 py-3 font-medium text-red-600">OUT</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">差引</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {teamStats.map(({ team, ins, outs, net }) => (
                    <tr key={team.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{team.short_name}</td>
                      <td className="px-4 py-3 text-center font-bold text-green-600">+{ins}</td>
                      <td className="px-4 py-3 text-center font-bold text-red-600">-{outs}</td>
                      <td className="px-4 py-3 text-center font-bold">
                        <span className={net > 0 ? 'text-green-600' : net < 0 ? 'text-red-600' : 'text-gray-400'}>
                          {net > 0 ? `+${net}` : net}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {total === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-2">🏀</p>
          <p>まだデータがありません</p>
        </div>
      )}
    </div>
  )
}
