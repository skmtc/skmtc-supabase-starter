import { ContentBase, decapitalize } from 'jsr:@skmtc/core@^0.0.756'
import type { GenerateContext, OasSchema, OasRef } from 'jsr:@skmtc/core@^0.0.756'
import { ZodInsertable } from 'jsr:@skmtc/gen-zod@^0.0.31'

type RequestBodyArgs = {
  context: GenerateContext
  serviceName: string
  destinationPath: string
  requestBodySchema: OasSchema | OasRef<'schema'> | undefined
}

export class RequestBody extends ContentBase {
  zodRequestBodyName: string | null

  constructor({ context, serviceName, destinationPath, requestBodySchema }: RequestBodyArgs) {
    super({ context })

    if (!requestBodySchema) {
      this.zodRequestBodyName = null

      return
    }

    const insertedRequestBody = context.insertNormalisedModel(ZodInsertable, {
      schema: requestBodySchema,
      fallbackName: decapitalize(`${serviceName}RequestBody`),
      destinationPath,
    })

    this.zodRequestBodyName = insertedRequestBody.identifier.name
  }

  override toString(): string {
    if (this.zodRequestBodyName === null) {
      return ''
    }

    return `  const requestBody = await c.req.json()
  const body = ${this.zodRequestBodyName}.parse(requestBody)
`
  }
}
