import { toTypedRxJsonSchema } from 'rxdb'

import { getCrdtSchema } from '@/utils'

import schema_raw from './output/todo_items'

import type { RxCollection, ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema } from 'rxdb'

const schema = toTypedRxJsonSchema(
	getCrdtSchema({
		version: 0,
		primaryKey: 'id',
		keyCompression: true,
		indexes: ['file_id', 'angle_id', 'status', 'archive_time'],
		...schema_raw['TodoItems.Item']
	} as const)
)

export type DocTodoItems = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema>
export type DBTodoItems = RxCollection<DocTodoItems>

export const schema_todo_items: RxJsonSchema<DocTodoItems> = schema
