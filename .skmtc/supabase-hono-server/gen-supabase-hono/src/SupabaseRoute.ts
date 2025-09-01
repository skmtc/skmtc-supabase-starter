import {
  camelCase,
  ContentBase,
  decapitalize,
  toMethodVerb,
  toPathParams,
  List,
} from 'jsr:@skmtc/core@^0.0.756'
import type { GenerateContext, OasOperation, ListObject } from 'jsr:@skmtc/core@^0.0.756'
import { RequestBody } from './RequestBody.ts'
import { Response } from './Response.ts'
import { ResponseVoid } from './ResponseVoid.ts'
import { toFirstSegment } from './toFirstSegment.ts'

type SupabaseRouteArgs = {
  context: GenerateContext
  operation: OasOperation
  destinationPath: string
}

export class SupabaseRoute extends ContentBase {
  operation: OasOperation
  pathParams: ListObject<string>
  queryParams: ListObject<string>
  requestBody: RequestBody
  response: Response | ResponseVoid

  constructor({ context, operation, destinationPath }: SupabaseRouteArgs) {
    super({ context })

    this.operation = operation

    const pathName = camelCase(operation.path, { upperFirst: true })

    const serviceName = decapitalize(`${toMethodVerb(operation.method)}${pathName}Api`)

    const responseSchema = operation.toSuccessResponse()?.resolve().toSchema()

    const pathParams = operation.toParams(['path']).map(({ name }) => name)
    const queryParams = operation.toParams(['query']).map(({ name }) => name)

    this.pathParams = List.toObject(pathParams)
    this.queryParams = List.toObject(queryParams)

    const combinedParams = List.toObject(pathParams.concat(queryParams))

    const requestBodySchema = operation.toRequestBody(({ schema }) => schema)

    this.requestBody = new RequestBody({
      context,
      serviceName,
      destinationPath,
      requestBodySchema,
    })

    const args = [`supabase: c.get('supabase')`, `claims: c.get('claims')`]

    if (requestBodySchema) {
      args.push(`body`)
    }

    if (combinedParams.values.length > 0) {
      args.push(`params: ${combinedParams}`)
    }

    const serviceArgs = List.toObject(args)

    const hasResponse = Boolean(responseSchema)

    this.response = hasResponse
      ? new Response({ context, serviceName, serviceArgs, responseSchema, destinationPath })
      : new ResponseVoid({ context, serviceName, serviceArgs })

    const firstSegment = toFirstSegment(operation)

    context.register({
      imports: {
        [`@/${firstSegment}/services.ts`]: [serviceName],
        '@/_shared/middleware.ts': ['withSupabase', 'withClaims'],
      },
      destinationPath,
    })
  }

  override toString(): string {
    const { method, path } = this.operation

    return `app.${method}('${toPathParams(path)}', withSupabase, withClaims, async c => {
  console.log('${method} ${toPathParams(path)}')

  ${this.pathParams.values.length > 0 ? `const ${this.pathParams} = c.req.param()` : ''}
  ${this.queryParams.values.length > 0 ? `const ${this.queryParams} = c.req.query()` : ''}

  ${this.requestBody}

  ${this.response}
})`
  }
}
