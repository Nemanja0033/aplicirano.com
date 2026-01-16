import { useQuery } from "@tanstack/react-query"
import { fetchStats } from "../service/stats-service"
import { StatsData } from "../types"

export function useStats(token: string | null, startDate: string, endDate: string) {
  return useQuery<StatsData>({
    queryKey: ['stats', token, startDate, endDate],
    queryFn: () => fetchStats(token, startDate, endDate),
    staleTime: 1000 * 60 * 5, 
    enabled: !!token
  })
}
