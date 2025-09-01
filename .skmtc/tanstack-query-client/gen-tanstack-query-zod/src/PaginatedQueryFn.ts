import type { ListObject, OperationInsertableArgs } from 'jsr:@skmtc/core@^0.0.756'
import { List, decapitalize, OasVoid } from 'jsr:@skmtc/core@^0.0.756'
import { TanstackQueryBase } from './base.ts'
import { ZodInsertable } from '@skmtc/gen-zod'
import { ApiUrl } from './ApiUrl.ts'

export class PaginatedQueryFn extends TanstackQueryBase {
  zodResponseName: string
  apiUrl: ApiUrl
  constructor({ context, operation, settings }: OperationInsertableArgs) {
    super({ context, operation, settings })

    this.apiUrl = new ApiUrl({ context, operation, destinationPath: settings.exportPath })

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
    const { method } = this.operation

    return `async () => {
      const { data, error } = await supabase.functions.invoke(${this.apiUrl}, {
        method: '${method.toUpperCase()}',
      })

      if (error) {
        throw error
      }

      return ${this.zodResponseName}.parse(data)
    }`
  }
}
