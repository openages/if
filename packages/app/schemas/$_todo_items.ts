import { toTypedRxJsonSchema } from 'rxdb'

import schema_raw from './output/$_todo_items'

import type { RxCollection, ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema } from 'rxdb'

const schema = toTypedRxJsonSchema({
	version: 0,
	primaryKey: 'id',
	// keyCompression: true,
	encrypted: ['title', 'text', 'children.[].text'],
	...schema_raw['TodoItems.Item']
} as const)

export type Doc$TodoItems = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema>
export type DB$TodoItems = RxCollection<Doc$TodoItems>

export const schema_$_todo_items: RxJsonSchema<Doc$TodoItems> = schema
