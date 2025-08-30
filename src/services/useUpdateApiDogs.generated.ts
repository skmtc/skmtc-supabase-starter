import { Dog, dog } from '@/models/dog.generated.ts'
import { supabase } from '@/lib/supabase'
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query'
import { z } from 'zod'

export type UseUpdateApiDogsArgs = {body: Dog};

export const useUpdateApiDogs = (args: UseMutationOptions<Dog,Error,UseUpdateApiDogsArgs,unknown> = {}) => {
      const queryClient = useQueryClient()
      
      const { onSuccess, ...rest } = args

      return useMutation({
        mutationFn: async ({body}: UseUpdateApiDogsArgs): Promise<Dog> => {      
      const { data, error } = await supabase.functions.invoke(`/dogs`, {
        method: 'PUT',
        body,
      })

      if (error) {
        throw error
      }
    
      return dog.parse(data)
    },
        onSuccess: (...successArgs) => {
          // Invalidate and refetch
          void queryClient.invalidateQueries({ queryKey: ['Dogs']})

           onSuccess?.(...successArgs)
        },
        ...rest
      })
    };
