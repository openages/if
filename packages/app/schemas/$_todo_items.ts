import { toTypedRxJsonSchema } from 'rxdb'

import { getCrdtSchema } from '@/utils'

import schema_raw from './output/$_todo_items'

import type { RxCollection, ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema } from 'rxdb'

const schema = getCrdtSchema(
	toTypedRxJsonSchema({
		version: 0,
		primaryKey: 'id',
            keyCompression: true,
		...schema_raw['TodoItems.Item']
	} as const)
)

export type Doc$TodoItems = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema>
export type DB$TodoItems = RxCollection<Doc$TodoItems>

export const schema_$_todo_items: RxJsonSchema<Doc$TodoItems> = schema
