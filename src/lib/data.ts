import { supabase } from './supabase'
import { Transfer } from '@/types'

export async function getTransfers(): Promise<Transfer[]> {
  const { data, error } = await supabase
    .from('transfers')
    .select('*')
    .order('announced_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error)
    return []
  }
  return data || []
}
