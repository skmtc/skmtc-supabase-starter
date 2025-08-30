import {
  type GenerateContext,
  ContentBase,
  type GeneratorKey,
  type Modifiers
} from 'jsr:@skmtc/core@^0.0.731'
import { applyModifiers } from './applyModifiers.ts'

type ZodNumberArgs = {
  context: GenerateContext
  modifiers: Modifiers
  destinationPath: string
  generatorKey: GeneratorKey
}

export class ZodNumber extends ContentBase {
  type = 'number' as const
  modifiers: Modifiers

  constructor({ context, modifiers, destinationPath, generatorKey }: ZodNumberArgs) {
    super({ context, generatorKey })

    this.modifiers = modifiers

    context.register({ imports: { zod: ['z'] }, destinationPath })
  }

  override toString(): string {
    return applyModifiers(`z.number()`, this.modifiers)
  }
}
