import { OasUnknown, ContentBase, handleKey, isEmpty } from 'jsr:@skmtc/core@^0.0.731'
import type {
  GenerateContext,
  GeneratorKey,
  OasRef,
  OasSchema,
  OasObject,
  CustomValue,
  RefName,
  TypeSystemObjectProperties,
  TypeSystemRecord,
  TypeSystemValue,
  Modifiers
} from 'jsr:@skmtc/core@^0.0.731'
import { toZodValue } from './Zod.ts'
import { applyModifiers } from './applyModifiers.ts'

type ZodObjectProps = {
  context: GenerateContext
  destinationPath: string
  objectSchema: OasObject
  modifiers: Modifiers
  generatorKey: GeneratorKey
  rootRef?: RefName
}

export class ZodObject extends ContentBase {
  type = 'object' as const
  recordProperties: TypeSystemRecord | null
  objectProperties: TypeSystemObjectProperties | null
  modifiers: Modifiers

  constructor({
    context,
    generatorKey,
    destinationPath,
    objectSchema,
    modifiers,
    rootRef
  }: ZodObjectProps) {
    super({ context, generatorKey })

    this.modifiers = modifiers

    const { properties, required, additionalProperties } = objectSchema

    if (!properties || isEmpty(properties)) {
      this.recordProperties = new ZodRecord({
        context,
        generatorKey,
        destinationPath,
        schema: new OasUnknown({}),
        modifiers,
        rootRef
      })
      this.objectProperties = null
    } else {
      this.recordProperties = additionalProperties
        ? new ZodRecord({
            context,
            generatorKey,
            destinationPath,
            schema: additionalProperties,
            modifiers,
            rootRef
          })
        : null

      this.objectProperties = new ZodObjectProperties({
        context,
        generatorKey,
        destinationPath,
        properties,
        required, // 'required' here refers to the object's properties, not object itself,
        modifiers,
        rootRef
      })
    }

    context.register({ imports: { zod: ['z'] }, destinationPath })
  }

  override toString(): string {
    const { objectProperties, recordProperties } = this

    if (objectProperties && recordProperties) {
      return applyModifiers(`z.union([${objectProperties}, ${recordProperties}])`, this.modifiers)
    }

    return applyModifiers(
      recordProperties?.toString() ?? objectProperties?.toString() ?? 'z.object({})',
      this.modifiers
    )
  }
}

type ZodObjectPropertiesArgs = {
  modifiers: Modifiers
  context: GenerateContext
  destinationPath: string
  properties: Record<string, OasSchema | OasRef<'schema'> | CustomValue>
  required: OasObject['required']
  generatorKey: GeneratorKey
  rootRef?: RefName
}

class ZodObjectProperties extends ContentBase {
  properties: Record<string, TypeSystemValue>
  required: string[]

  constructor({
    context,
    generatorKey,
    destinationPath,
    properties,
    required = [],
    rootRef
  }: ZodObjectPropertiesArgs) {
    super({ context, generatorKey })

    this.required = required

    this.properties = Object.fromEntries(
      Object.entries(properties).map(([key, property]) => {
        const value = toZodValue({
          destinationPath,
          schema: property,
          required: required?.includes(key),
          context,
          rootRef
        })

        return [handleKey(key), value]
      })
    )
  }

  override toString(): string {
    console
    return `z.object({${Object.entries(this.properties)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')}})`
  }
}

type ZodRecordArgs = {
  context: GenerateContext
  destinationPath: string
  schema: true | OasSchema | OasRef<'schema'>
  modifiers: Modifiers
  generatorKey: GeneratorKey
  rootRef?: RefName
}

class ZodRecord extends ContentBase {
  value: TypeSystemValue | 'true'

  constructor({
    context,
    generatorKey,
    destinationPath,
    schema,
    modifiers,
    rootRef
  }: ZodRecordArgs) {
    super({ context, generatorKey })

    this.value = toZodRecordChildren({
      context,
      destinationPath,
      schema,
      modifiers,
      rootRef
    })
  }

  override toString(): string {
    return `z.record(z.string(), ${this.value})`
  }
}

type ZodRecordChildrenArgs = {
  context: GenerateContext
  destinationPath: string
  schema: true | OasSchema | OasRef<'schema'>
  modifiers: Modifiers
  rootRef?: RefName
}

const toZodRecordChildren = ({
  context,
  destinationPath,
  schema,
  rootRef
}: ZodRecordChildrenArgs) => {
  if (schema === true) {
    return 'true'
  }
  if (isEmpty(schema)) {
    return 'true'
  }

  return toZodValue({
    destinationPath,
    schema,
    required: true,
    context,
    rootRef
  })
}
