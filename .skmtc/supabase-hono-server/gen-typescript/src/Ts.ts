import { TsString } from './TsString.ts'
import { TsArray } from './TsArray.ts'
import { match } from 'npm:ts-pattern@^5.8.0'
import { TsRef } from './TsRef.ts'
import { TsObject } from './TsObject.ts'
import { TsUnion } from './TsUnion.ts'
import type { Modifiers, SchemaToValueFn, SchemaType } from 'jsr:@skmtc/core@^0.0.756'
import { TsNumber } from './TsNumber.ts'
import { TsInteger } from './TsInteger.ts'
import { TsBoolean } from './TsBoolean.ts'
import { TsVoid } from './TsVoid.ts'
import { TsUnknown } from './TsUnknown.ts'
import { toGeneratorOnlyKey, toRefName } from 'jsr:@skmtc/core@^0.0.756'
import { typescriptEntry } from './mod.ts'

export const toTsValue: SchemaToValueFn = ({
  schema,
  destinationPath,
  required,
  context,
  rootRef,
}) => {
  const modifiers: Modifiers = {
    required,
    // description: 'description' in schema ? schema.description : undefined,
    nullable: 'nullable' in schema ? schema.nullable : undefined,
  }

  const generatorKey = toGeneratorOnlyKey({ generatorId: typescriptEntry.id })

  return match(schema satisfies SchemaType)
    .with({ type: 'custom' }, custom => custom)
    .with({ type: 'ref' }, ref => {
      return new TsRef({
        context,
        destinationPath,
        refName: toRefName(ref.$ref),
        modifiers,
        rootRef,
      })
    })
    .with({ type: 'array' }, ({ items }) => {
      return new TsArray({ context, destinationPath, modifiers, items, generatorKey, rootRef })
    })
    .with({ type: 'object' }, matched => {
      return new TsObject({
        context,
        destinationPath,
        value: matched,
        modifiers,
        generatorKey,
        rootRef,
      })
    })
    .with({ type: 'union' }, ({ members, discriminator }) => {
      return new TsUnion({
        context,
        destinationPath,
        members,
        discriminator,
        modifiers,
        generatorKey,
        rootRef,
      })
    })
    .with({ type: 'number' }, () => new TsNumber({ context, modifiers, generatorKey }))
    .with(
      { type: 'integer' },
      integerSchema => new TsInteger({ context, integerSchema, modifiers, generatorKey }),
    )
    .with({ type: 'boolean' }, () => new TsBoolean({ context, modifiers, generatorKey }))
    .with({ type: 'void' }, () => new TsVoid({ context, generatorKey }))
    .with(
      { type: 'string' },
      stringSchema => new TsString({ context, stringSchema, modifiers, generatorKey }),
    )
    .with({ type: 'unknown' }, () => new TsUnknown({ context, generatorKey }))
    .exhaustive()
}
