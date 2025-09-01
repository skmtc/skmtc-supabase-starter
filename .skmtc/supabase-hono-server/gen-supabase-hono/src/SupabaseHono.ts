import type {
  OperationInsertableArgs,
  ListArray,
  OasOperation,
  ListLines,
} from 'jsr:@skmtc/core@^0.0.756'
import { List } from 'jsr:@skmtc/core@^0.0.756'
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
        hono: ['Hono'],
      },
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
        destinationPath: this.settings.exportPath,
      }),
    )
  }

  override toString(): string {
    return `new Hono()
${this.routes}
`
  }
}
