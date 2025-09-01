import { createMiddleware } from 'hono/factory'
import { createClient, JwtPayload, SupabaseClient } from '@supabase/supabase-js'

export const withSupabase = createMiddleware<{
  Variables: {
    supabase: SupabaseClient
  }
}>(async (c, next) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!,
    {
      global: {
        headers: { Authorization: c.req.header('Authorization')! },
      },
    },
  )

  c.set('supabase', supabase)

  await next()
})

export const withClaims = createMiddleware<{
  Variables: {
    supabase: SupabaseClient
    claims: JwtPayload | undefined
  }
}>(async (c, next) => {
  const { data, error } = await c.get('supabase').auth.getClaims()

  if (error) {
    throw error
  }

  c.set('claims', data?.claims)

  await next()
})
