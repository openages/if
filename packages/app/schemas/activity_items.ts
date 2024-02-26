import { toTypedRxJsonSchema } from 'rxdb'

import { keyCompression } from '@/config'

import schema_raw from './output/activity_items'

import type { ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema } from 'rxdb'
import type { RxDB } from '@/types'

const schema = toTypedRxJsonSchema({
	version: 0,
	primaryKey: 'id',
	keyCompression,
	indexes: ['module', 'file_id'],
	...schema_raw['Activity.Item']
} as const)

export type DocActivityItems = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema>
export type DBActivityItems = RxDB.RxCollectionWithFunctions<DocActivityItems>

export const schema_activity_items: RxJsonSchema<DocActivityItems> = schema
