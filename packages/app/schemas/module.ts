import { toTypedRxJsonSchema } from 'rxdb'

import schema_raw from './output/module'

import type { RxCollection, ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema } from 'rxdb'

const schema = toTypedRxJsonSchema({
	version: 0,
	primaryKey: 'module',
	// keyCompression: true,
	encrypted: ['dirtree.[].name'],
	...schema_raw['Module.Item']
} as const)

export type DocModule = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema>
export type DBModule = RxCollection<DocModule>

export const schema_module: RxJsonSchema<DocModule> = schema
