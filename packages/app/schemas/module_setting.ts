import { toTypedRxJsonSchema } from 'rxdb'

import { getCrdtSchema } from '@/utils'

import schema_raw from './output/module_setting'

import type { ExtractDocumentTypeFromTypedRxJsonSchema, RxCollection, RxJsonSchema } from 'rxdb'

const schema = toTypedRxJsonSchema(
	getCrdtSchema({
		version: 1,
		primaryKey: 'module',
		keyCompression: true,
		...schema_raw['ModuleSetting.Item']
	} as const)
)

export type DocModuleSetting = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema>
export type DBModuleSetting = RxCollection<DocModuleSetting>

export const schema_module_setting: RxJsonSchema<DocModuleSetting> = schema
