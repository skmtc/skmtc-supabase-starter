import { dog } from '@/models/dog.generated.ts'
import { supabase } from '@/lib/supabase'
import { useQuery } from '@tanstack/react-query'

export type UseGetApiDogsIdArgs = {id: string};

export const useGetApiDogsId = ({id}: UseGetApiDogsIdArgs) => {
      const result = useQuery({
        queryKey: ['Dogs', id],
        queryFn: async () => {
      const { data, error } = await supabase.functions.invoke(`/dogs/${id}`, {
        method: 'GET'
      })

      if (error) {
        throw error
      }

      return dog.parse(data)
    }
      })

      return result
    };
