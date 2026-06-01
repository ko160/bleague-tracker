'use client'

import { useState } from 'react'
import { Transfer } from '@/types'
import { Team } from '@/types'
import StatusBadge from './StatusBadge'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Search } from 'lucide-react'

interface Props {
  transfers: Transfer[]
  teams: Team[]
}

export default function PlayerTable({ transfers, teams }: Props) {
  const [search, setSearch] = useState('')
  const [teamFilter, setTeamFilter] = useState('all')

  const filtered = transfers.filter((t) => {
    const matchSearch = search === '' || t.player_name.includes(search)
    const matchTeam = teamFilter === 'all' || t.from_team === teamFilter || t.to_team === teamFilter
    return matchSearch && matchTeam
  })

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="選手名で検索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"
        >
          <option value="all">全チーム</option>
          {teams.map((t) => (
            <option key={t.id} value={t.name}>{t.short_name}</option>
          ))}
        </select>
      </div>

      <p className="text-sm text-gray-500">{filtered.length}件</p>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">選手名</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">状態</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">移籍前</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">移籍先</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">発表日</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-gray-900">{t.player_name}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} size="sm" /></td>
                  <td className="px-4 py-3 text-gray-600">{t.from_team ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{t.to_team ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {format(new Date(t.announced_at), 'M/d', { locale: ja })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">🏀</p>
            <p>該当する選手はいません</p>
          </div>
        )}
      </div>
    </>
  )
}
