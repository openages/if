import { autolock_map, modules } from '@/appdata'

export namespace App {
	export type ModuleType = Exclude<(typeof modules)[number]['title'], 'setting'>

	export interface Module {
		id: App.ModuleType
		title: App.ModuleType
		path: string
		short?: number
		fixed?: boolean
		plan?: boolean
		deving?: boolean
		event?: string
	}

	export type Modules = Array<Module>

	export interface Screenlock {
		private_key: string
		public_key: string
		password: string
		autolock: keyof typeof autolock_map
		unlocking?: boolean
	}

	export interface ModuleSetting {
		file_id: string
		module: string
		setting: any
	}
}
