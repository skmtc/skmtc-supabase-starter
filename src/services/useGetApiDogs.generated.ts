import { dogList } from '@/models/dogList.generated.ts'
import { supabase } from '@/lib/supabase'
import { useQuery, keepPreviousData } from '@tanstack/react-query'

export type UseGetApiDogsArgs = Record<string, unknown>

export const useGetApiDogs = () => {
  const result = useQuery({
    queryKey: ['Dogs'],
    queryFn: async ({ name }: { name?: string }) => {
      const url = new URL(`/dogs`)

      Object.entries({ name }).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, value)
        }
      })

      const { data, error } = await supabase.functions.invoke(url.toString(), {
        method: 'GET',
      })

      if (error) {
        throw error
      }

      return dogList.parse(data)
    },
    placeholderData: keepPreviousData,
  })

  return result
}
