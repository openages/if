import { toTypedRxJsonSchema } from 'rxdb'

import { getCrdtSchema } from '@/utils'

import schema_raw from './output/$_todo_archive'

import type { RxCollection, ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema } from 'rxdb'

const schema = getCrdtSchema(
	toTypedRxJsonSchema({
		version: 0,
		primaryKey: 'id',
		keyCompression: true,
		...schema_raw['TodoArchive.Item']
	} as const)
)

export type Doc$TodoArchive = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema>
export type DB$TodoArchive = RxCollection<Doc$TodoArchive>

export const schema_$_todo_archive: RxJsonSchema<Doc$TodoArchive> = schema
