import type { ListObject, OperationInsertableArgs } from 'jsr:@skmtc/core@^0.0.731'
import { List, toPathTemplate, decapitalize, OasVoid } from 'jsr:@skmtc/core@^0.0.731'
import { TanstackQueryBase } from './base.ts'
import { ZodInsertable } from '@skmtc/gen-zod'

export class PaginatedQueryFn extends TanstackQueryBase {
  zodResponseName: string
  queryParamArgs: ListObject<string>

  constructor({ context, operation, settings }: OperationInsertableArgs) {
    super({ context, operation, settings })

    this.queryParamArgs = List.toObject(operation.toParams(['query']).map(({ name }) => name))

    const zodResponse = this.insertNormalizedModel(ZodInsertable, {
      schema: operation.toSuccessResponse()?.resolve().toSchema() ?? OasVoid.empty(),
      fallbackName: `${decapitalize(settings.identifier.name)}Response`,
    })

    this.zodResponseName = zodResponse.identifier.name

    this.register({
      imports: { '@/lib/supabase': ['supabase'] },
    })
  }

  override toString(): string {
    const { path, method } = this.operation

    return `async () => {
      const { data, error } = await supabase.functions.invoke(\`${toPathTemplate(path)}\`, {
        method: '${method.toUpperCase()}',
      })

      if (error) {
        throw error
      }

      return ${this.zodResponseName}.parse(data)
    }`
  }
}
