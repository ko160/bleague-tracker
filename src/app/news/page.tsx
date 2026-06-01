import { getTransfers } from '@/lib/data'
import NewsFeed from '@/components/NewsFeed'

export const dynamic = 'force-dynamic'

export default async function NewsPage() {
  const transfers = await getTransfers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">最新情報</h1>
        <p className="text-sm text-gray-500 mt-1">各球団の公式発表をもとに随時更新</p>
      </div>
      <NewsFeed transfers={transfers} />
    </div>
  )
}
