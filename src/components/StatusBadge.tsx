import { TransferStatus, STATUS_LABEL, STATUS_COLOR, STATUS_ICON } from '@/types'

interface Props {
  status: TransferStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${STATUS_COLOR[status]} ${sizeClass}`}>
      <span>{STATUS_ICON[status]}</span>
      {STATUS_LABEL[status]}
    </span>
  )
}
