import { Hono } from 'npm:hono@4.5.6'
import { cors } from 'npm:hono@4.5.6/cors'
import { sentry } from 'npm:@hono/sentry@1.2.0'
import { DogList } from '@/_shared/models/dogList.generated.ts'
import { getDogsApi, createDogsApi, updateDogsApi } from './services.ts'
import { dog, Dog } from '@/_shared/models/dog.generated.ts'

export const app = new Hono()

app.use(
  '*',
  sentry({
    dsn: Deno.env.get('SENTRY_DSN_SUPABASE'),
    tracesSampleRate: 1.0,
  }),
)

app.onError((error, c) => {
  c.get('sentry').captureException(error)

  console.log('ERROR', error)

  return c.json({ message: 'Internal server error' }, 500)
})

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT'],
    maxAge: 600,
    allowHeaders: [
      'authorization',
      'x-client-info',
      'apikey',
      'sentry-trace',
      'baggage',
      'content-type',
    ],
  }),
)

app.get('/dogs', async c => {
  console.log('get /dogs')

  const res: DogList = await getDogsApi({ req: c.req })()

  if (!res) {
    return c.body(null, 404)
  }

  return c.json(res)
})
app.post('/dogs', async c => {
  console.log('post /dogs')

  const requestBody = await c.req.json()
  const body = dog.parse(requestBody)

  const res: Dog = await createDogsApi({ req: c.req, body })()

  if (!res) {
    return c.body(null, 404)
  }

  return c.json(res)
})
app.put('/dogs', async c => {
  console.log('put /dogs')

  const requestBody = await c.req.json()
  const body = dog.parse(requestBody)

  const res: Dog = await updateDogsApi({ req: c.req, body })()

  if (!res) {
    return c.body(null, 404)
  }

  return c.json(res)
})
