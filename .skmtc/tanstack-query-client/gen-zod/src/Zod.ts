import { ZodString } from './ZodString.ts'
import { ZodArray } from './ZodArray.ts'
import { match } from 'npm:ts-pattern@^5.8.0'
import { ZodRef } from './ZodRef.ts'
import { ZodObject } from './ZodObject.ts'
import { ZodUnion } from './ZodUnion.ts'
import type { SchemaToValueFn, SchemaType, Modifiers } from 'jsr:@skmtc/core@^0.0.756'
import { ZodNumber } from './ZodNumber.ts'
import { ZodInteger } from './ZodInteger.ts'
import { ZodBoolean } from './ZodBoolean.ts'
import { ZodVoid } from './ZodVoid.ts'
import { ZodUnknown } from './ZodUnknown.ts'
import { toGeneratorOnlyKey, toRefName } from 'jsr:@skmtc/core@^0.0.756'
import { zodEntry } from './mod.ts'

export const toZodValue: SchemaToValueFn = ({
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

  const generatorKey = toGeneratorOnlyKey({ generatorId: zodEntry.id })

  return match(schema satisfies SchemaType)
    .with({ type: 'custom' }, custom => custom)
    .with({ type: 'ref' }, ref => {
      return new ZodRef({
        context,
        destinationPath,
        refName: toRefName(ref.$ref),
        modifiers,
        rootRef,
      })
    })
    .with({ type: 'array' }, ({ items }) => {
      return new ZodArray({ context, destinationPath, modifiers, items, generatorKey, rootRef })
    })
    .with({ type: 'object' }, objectSchema => {
      return new ZodObject({
        context,
        destinationPath,
        objectSchema,
        modifiers,
        generatorKey,
        rootRef,
      })
    })
    .with({ type: 'union' }, ({ members, discriminator }) => {
      return new ZodUnion({
        context,
        destinationPath,
        members,
        discriminator,
        modifiers,
        generatorKey,
        rootRef,
      })
    })
    .with(
      { type: 'number' },
      () => new ZodNumber({ context, modifiers, destinationPath, generatorKey }),
    )
    .with({ type: 'integer' }, integerSchema => {
      return new ZodInteger({ context, integerSchema, modifiers, destinationPath, generatorKey })
    })
    .with(
      { type: 'boolean' },
      () => new ZodBoolean({ context, modifiers, destinationPath, generatorKey }),
    )
    .with({ type: 'void' }, () => new ZodVoid({ context, destinationPath, generatorKey }))
    .with(
      { type: 'string' },
      stringSchema =>
        new ZodString({ context, stringSchema, modifiers, destinationPath, generatorKey }),
    )
    .with({ type: 'unknown' }, () => new ZodUnknown({ context, destinationPath, generatorKey }))
    .exhaustive()
}
