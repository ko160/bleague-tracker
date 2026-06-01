import { Transfer } from '@/types'
import StatusBadge from './StatusBadge'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ExternalLink } from 'lucide-react'

interface Props {
  transfer: Transfer
}

export default function TransferCard({ transfer }: Props) {
  const date = format(new Date(transfer.announced_at), 'M月d日', { locale: ja })

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={transfer.status} />
            <span className="text-xs text-gray-400">{date}</span>
          </div>

          <p className="mt-2 font-bold text-gray-900 text-lg">{transfer.player_name}</p>

          <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            {transfer.from_team && (
              <span className="bg-gray-100 px-2 py-0.5 rounded">{transfer.from_team}</span>
            )}
            {transfer.from_team && transfer.to_team && (
              <span className="text-gray-400">→</span>
            )}
            {transfer.to_team && (
              <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded font-medium">
                {transfer.to_team}
              </span>
            )}
          </div>

          {transfer.notes && (
            <p className="mt-1.5 text-xs text-gray-500">{transfer.notes}</p>
          )}
        </div>

      </div>

      {transfer.source_name && (
        <div className="mt-2">
          {transfer.source_url ? (
            <a
              href={transfer.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 hover:underline transition-colors"
            >
              <ExternalLink size={12} />
              {transfer.source_name}で確認する
            </a>
          ) : (
            <p className="text-xs text-gray-400">📎 {transfer.source_name}</p>
          )}
        </div>
      )}
    </div>
  )
}
