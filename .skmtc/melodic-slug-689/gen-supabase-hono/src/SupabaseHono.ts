import type {
  OperationInsertableArgs,
  ListArray,
  OasOperation,
  ListLines
} from 'jsr:@skmtc/core@^0.0.731'
import { List } from 'jsr:@skmtc/core@^0.0.731'
import { SupabaseHonoBase } from './base.ts'
import { SupabaseRoute } from './SupabaseRoute.ts'

export class SupabaseHono extends SupabaseHonoBase {
  methods: ListArray<string>
  routes: ListLines<SupabaseRoute>
  constructor({ context, operation, settings }: OperationInsertableArgs) {
    super({ context, operation, settings })

    this.methods = List.toArray([])
    this.routes = List.toLines([])

    this.register({
      imports: {
        'npm:hono@4.5.6': ['Hono'],
        'npm:hono@4.5.6/cors': ['cors'],
        'npm:@hono/sentry@1.2.0': ['sentry']
      }
    })
  }

  append(operation: OasOperation) {
    const method = `'${operation.method.toUpperCase()}'`

    if (!this.methods.values.includes(method)) {
      this.methods.values.push(method)
    }

    this.routes.values.push(
      new SupabaseRoute({
        context: this.context,
        operation,
        destinationPath: this.settings.exportPath
      })
    )
  }

  override toString(): string {
    return `new Hono()

app.use(
  '*',
  sentry({
    dsn: Deno.env.get('SENTRY_DSN_SUPABASE'),
    tracesSampleRate: 1.0
  })
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
    allowMethods: ${this.methods},
    maxAge: 600,
    allowHeaders: [
      'authorization',
      'x-client-info',
      'apikey',
      'sentry-trace',
      'baggage',
      'content-type'
    ]
  })
)

${this.routes}
`
  }
}
