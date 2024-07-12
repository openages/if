import { toTypedRxJsonSchema } from 'rxdb'

import { keyCompression } from '@/config'
import { getCrdtSchema } from '@/utils'

import schema_raw from './output/note_items'

import type { ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema } from 'rxdb'
import type { RxDB } from '@/types'

const schema = toTypedRxJsonSchema(
	getCrdtSchema({
		version: 0,
		primaryKey: 'id',
		keyCompression,
		indexes: ['file_id'],
		...schema_raw['Note.Item']
	} as const)
)

export type DocNoteItems = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema>
export type DBNoteItems = RxDB.RxCollectionWithFunctions<DocNoteItems>

export const schema_note_items: RxJsonSchema<DocNoteItems> = schema
