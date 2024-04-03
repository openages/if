import { toTypedRxJsonSchema } from 'rxdb'

import { keyCompression } from '@/config'

import schema_raw from './output/note_items'

import type { ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema } from 'rxdb'
import type { RxDB } from '@/types'

const schema = toTypedRxJsonSchema({
	version: 0,
	primaryKey: 'file_id',
	keyCompression,
	...schema_raw['Note.Item']
} as const)

export type DocNoteItems = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema>
export type DBNoteItems = RxDB.RxCollectionWithFunctions<DocNoteItems>

export const schema_note_items: RxJsonSchema<DocNoteItems> = schema
