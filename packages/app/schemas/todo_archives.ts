import { toTypedRxJsonSchema } from 'rxdb'

import { getCrdtSchema } from '@/utils'

import schema_raw from './output/todo_archives'

import type { RxCollection, ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema } from 'rxdb'

const schema = toTypedRxJsonSchema(
	getCrdtSchema({
		version: 0,
		primaryKey: 'id',
		keyCompression: true,
		indexes: ['file_id', 'angle_id', 'status', 'archive_time'],
		...schema_raw['TodoArchive.Item']
	} as const)
)

export type DocTodoArchives = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema>
export type DBTodoArchives = RxCollection<DocTodoArchives>

export const schema_todo_archives: RxJsonSchema<DocTodoArchives> = schema
