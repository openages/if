import { toTypedRxJsonSchema } from 'rxdb'

import schema_raw from './output/todo'

import type { RxCollection, ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema } from 'rxdb'

const schema = toTypedRxJsonSchema({
	version: 0,
	primaryKey: 'id',
	keyCompression: true,
	...schema_raw['Todo.Data']
} as const)

export type DocTodo = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema>
export type DBTodo = RxCollection<DocTodo>

export const schema_todo: RxJsonSchema<DocTodo> = schema
