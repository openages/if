import fs from 'fs'
import * as globby from 'globby'
import * as tsj from 'ts-json-schema-generator'

import handleSchema from '../utils/rxdb/handleSchema'

import type { Config } from 'ts-json-schema-generator'

const root = process.cwd()
const paths = globby.globbySync([`${root}/types/schema/*.ts`])

const raw_app_types = fs.readFileSync(`${root}/types/app.ts`).toString()

fs.writeFileSync(
	`${root}/types/app.ts`,
	raw_app_types
		.replace(`// export type ModuleType`, `export type ModuleType`)
		.replace(
			`export type ModuleType = (typeof modules)[number]['title']`,
			`// export type ModuleType = (typeof modules)[number]['title']`
		)
		.replace(`// /** @maxLength 30 */`, `/** @maxLength 30 */`)
		.replace(
			`	// 	| 'todo'
	// 	| 'memo'
	// 	| 'note'
	// 	| 'kanban'
	// 	| 'workflow'
	// 	| 'whiteboard'
	// 	| 'ppt'
	// 	| 'schedule'
	// 	| 'pomodoro'
	// 	| 'flag'
	// 	| 'api'
	// 	| 'dataflow'
	// 	| 'table'
	// 	| 'form'
	// 	| 'chart'
	// 	| 'setting'`,
			`		| 'todo'
            | 'memo'
            | 'note'
            | 'kanban'
            | 'workflow'
            | 'whiteboard'
            | 'ppt'
            | 'schedule'
            | 'pomodoro'
            | 'flag'
            | 'api'
            | 'dataflow'
            | 'table'
            | 'form'
            | 'chart'
            | 'setting'`
		)
)

const getConfig = (path: string) => {
	return {
		path,
		type: '*',
		skipTypeCheck: true,
		topRef: true,
		encodeRefs: true,
		additionalProperties: true,
		extraTags: ['x_ref']
	} as Config
}

paths.map((item) => {
	const buffer = tsj.createGenerator(getConfig(item)).createSchema('*')

	// console.log(JSON.stringify(buffer,null,4));

	const schema = handleSchema(buffer.definitions, buffer.definitions)

	fs.writeFileSync(
		`${root}/schemas/output/${item.split('/').pop()}`,
		`export default ${JSON.stringify(schema, null, 6)} as const`
	)
})

fs.writeFileSync(`${root}/types/app.ts`, raw_app_types)
