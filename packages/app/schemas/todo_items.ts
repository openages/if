import { toTypedRxJsonSchema } from 'rxdb'

import { keyCompression } from '@/config'
import { getCrdtSchema } from '@/utils'

import schema_raw from './output/todo_items'

import type { ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema } from 'rxdb'
import type { RxDB } from '@/types'

const schema = toTypedRxJsonSchema(
	getCrdtSchema({
		version: 1,
		primaryKey: 'id',
		keyCompression,
		indexes: ['file_id', 'text', 'angle_id', 'status', 'recycle_time', 'archive_time', 'start_time'],
		...schema_raw['TodoItems.Item']
	} as const)
)

export type DocTodoItems = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema>
export type DBTodoItems = RxDB.RxCollectionWithFunctions<DocTodoItems>

export const schema_todo_items: RxJsonSchema<DocTodoItems> = schema
