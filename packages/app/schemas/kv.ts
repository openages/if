import { toTypedRxJsonSchema } from 'rxdb'

import { keyCompression } from '@/config'

import schema_raw from './output/kv'

import type { ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema } from 'rxdb'
import type { RxDB } from '@/types'

const schema = toTypedRxJsonSchema({
	version: 0,
	primaryKey: 'key',
	keyCompression,
	...schema_raw['KV.Item']
} as const)

export type DocKV = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema>
export type DBKV = RxDB.RxCollectionWithFunctions<DocKV>

export const schema_kv: RxJsonSchema<DocKV> = schema
