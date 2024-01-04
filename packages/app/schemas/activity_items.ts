import { toTypedRxJsonSchema } from 'rxdb'

import { keyCompression } from '@/config'
import { getCrdtSchema } from '@/utils'

import schema_raw from './output/activity_items'

import type { ExtractDocumentTypeFromTypedRxJsonSchema, RxCollection, RxJsonSchema } from 'rxdb'

const schema = toTypedRxJsonSchema(
	getCrdtSchema({
		version: 1,
		primaryKey: 'id',
		keyCompression,
		indexes: ['module'],
		...schema_raw['ActivityItems.Item']
	} as const)
)

export type DocActivityItems = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema>
export type DBActivityItems = RxCollection<DocActivityItems>

export const schema_activity_items: RxJsonSchema<DocActivityItems> = schema
