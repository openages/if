import { toTypedRxJsonSchema } from 'rxdb'

import schema_raw from './output/$_todo_archive'

import type { RxCollection, ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema } from 'rxdb'

const schema = toTypedRxJsonSchema({
      version: 0,
      primaryKey: 'id',
      keyCompression: true,
      encrypted: ['todo.title', 'todo.text'],
      ...schema_raw['TodoArchive.Item']
} as const)

export type Doc$TodoArchive = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema>
export type DB$TodoArchive = RxCollection<Doc$TodoArchive>

export const schema_$_todo_archive: RxJsonSchema<Doc$TodoArchive> = schema
