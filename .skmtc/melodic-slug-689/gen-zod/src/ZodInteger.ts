import { ContentBase } from 'jsr:@skmtc/core@^0.0.731'
import { applyModifiers } from './applyModifiers.ts'
import type { GenerateContext, Modifiers, OasInteger, GeneratorKey } from 'jsr:@skmtc/core@^0.0.731'

import { match, P } from 'npm:ts-pattern@^5.8.0'

type ZodIntegerArgs = {
  context: GenerateContext
  integerSchema: OasInteger
  modifiers: Modifiers
  destinationPath: string
  generatorKey: GeneratorKey
}

export class ZodInteger extends ContentBase {
  type = 'integer' as const
  modifiers: Modifiers
  format?: 'int32' | 'int64'
  enums?: number[] | (number | null)[]

  constructor({
    context,
    integerSchema,
    modifiers,
    destinationPath,
    generatorKey
  }: ZodIntegerArgs) {
    super({ context, generatorKey })

    this.format = integerSchema.format
    this.enums = integerSchema.enums
    this.modifiers = modifiers

    context.register({ imports: { zod: ['z'] }, destinationPath })
  }

  override toString(): string {
    const { enums } = this

    const content = match({ enums })
      .with({ enums: P.array() }, ({ enums }) => {
        return enums.length === 1
          ? `z.literal(${enums[0]})`
          : `z.union([${enums.map(e => `z.literal(${e})`).join(', ')}])`
      })
      .otherwise(() => {
        return `z.number().int()`
      })

    return applyModifiers(content, this.modifiers)
  }
}
