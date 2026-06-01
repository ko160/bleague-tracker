export type TransferStatus = 'transfer' | 'new' | 'departure' | 'renewal'

export interface Transfer {
  id: string
  player_name: string
  from_team: string | null
  to_team: string | null
  status: TransferStatus
  announced_at: string
  source_url: string | null
  source_name: string | null
  notes: string | null
}

export interface Team {
  id: string
  name: string
  short_name: string
  division: 'B1' | 'B2' | 'B3'
  color: string
}

export const STATUS_LABEL: Record<TransferStatus, string> = {
  transfer: '移籍',
  new: '新加入',
  departure: '退団',
  renewal: '継続',
}

export const STATUS_COLOR: Record<TransferStatus, string> = {
  transfer: 'bg-blue-100 text-blue-700 border-blue-200',
  new: 'bg-green-100 text-green-700 border-green-200',
  departure: 'bg-red-100 text-red-700 border-red-200',
  renewal: 'bg-gray-100 text-gray-600 border-gray-200',
}

export const STATUS_ICON: Record<TransferStatus, string> = {
  transfer: '🔄',
  new: '✅',
  departure: '👋',
  renewal: '🔒',
}
