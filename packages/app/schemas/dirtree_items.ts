import { toTypedRxJsonSchema } from 'rxdb'

import { keyCompression } from '@/config'
import { getCrdtSchema } from '@/utils'

import schema_raw from './output/dirtree_items'

import type { RxCollection, ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema } from 'rxdb'

const schema = toTypedRxJsonSchema(
	getCrdtSchema({
		version: 1,
		primaryKey: 'id',
		keyCompression,
		indexes: ['module'],
		...schema_raw['DirTreeItems.Item']
	} as const)
)

export type DocDirtreeItems = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema>
export type DBDirtreeItems = RxCollection<DocDirtreeItems>

export const schema_dirtree_items: RxJsonSchema<DocDirtreeItems> = schema
