'use client'

import { useState } from 'react'
import { Transfer, TransferStatus, STATUS_LABEL, STATUS_ICON } from '@/types'
import TransferCard from './TransferCard'

const FILTERS: { value: TransferStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'transfer', label: `${STATUS_ICON.transfer} ${STATUS_LABEL.transfer}` },
  { value: 'new', label: `${STATUS_ICON.new} ${STATUS_LABEL.new}` },
  { value: 'departure', label: `${STATUS_ICON.departure} ${STATUS_LABEL.departure}` },
  { value: 'renewal', label: `${STATUS_ICON.renewal} ${STATUS_LABEL.renewal}` },
]

export default function NewsFeed({ transfers }: { transfers: Transfer[] }) {
  const [filter, setFilter] = useState<TransferStatus | 'all'>('all')

  const filtered = filter === 'all'
    ? transfers
    : transfers.filter((t) => t.status === filter)

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === f.value
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500">{filtered.length}件</p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => <TransferCard key={t.id} transfer={t} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-2">🏀</p>
          <p>該当する情報はありません</p>
        </div>
      )}
    </>
  )
}
