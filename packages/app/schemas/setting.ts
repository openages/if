import { toTypedRxJsonSchema } from 'rxdb'

import { getCrdtSchema } from '@/utils'

import schema_raw from './output/setting'

import type { RxCollection, ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema } from 'rxdb'

const schema = toTypedRxJsonSchema(
	getCrdtSchema({
		version: 1,
		primaryKey: 'key',
		keyCompression: true,
		...schema_raw['Setting.Data']
	} as const)
)

export type DocSetting = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schema>
export type DBSetting = RxCollection<DocSetting>

export const schema_setting: RxJsonSchema<DocSetting> = schema
