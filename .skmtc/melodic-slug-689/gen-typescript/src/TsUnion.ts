import { ContentBase } from 'jsr:@skmtc/core@^0.0.731'
import type {
  GenerateContext,
  GeneratorKey,
  OasDiscriminator,
  OasSchema,
  OasRef,
  Modifiers,
  TypeSystemValue,
  RefName
} from 'jsr:@skmtc/core@^0.0.731'
import { toTsValue } from './Ts.ts'
import { applyModifiers } from './applyModifiers.ts'

type TsUnionArgs = {
  context: GenerateContext
  destinationPath: string
  members: (OasSchema | OasRef<'schema'>)[]
  discriminator?: OasDiscriminator
  modifiers: Modifiers
  generatorKey: GeneratorKey
  rootRef?: RefName
}

export class TsUnion extends ContentBase {
  type = 'union' as const
  members: TypeSystemValue[]
  discriminator: string | undefined
  modifiers: Modifiers

  constructor({
    context,
    generatorKey,
    destinationPath,
    members,
    discriminator,
    modifiers,
    rootRef
  }: TsUnionArgs) {
    super({ context, generatorKey })

    this.members = members.map(member => {
      return toTsValue({
        destinationPath,
        schema: member,
        required: true,
        context,
        rootRef
      })
    })

    this.discriminator = discriminator?.propertyName
    this.modifiers = modifiers
  }

  override toString(): string {
    const members = this.members.map(member => `${member}`).join(' | ')

    return applyModifiers(members, this.modifiers)
  }
}
