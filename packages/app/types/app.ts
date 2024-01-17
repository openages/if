import { autolock_map, modules } from '@/appdata'

export namespace App {
	export type ModuleType = (typeof modules)[number]['title']

	export interface Module {
		id: App.ModuleType
		title: App.ModuleType
		path: string
		fixed?: boolean
	}

	export type Modules = Array<Module>

	export interface Screenlock {
		private_key: string
		public_key: string
		password: string
		autolock: keyof typeof autolock_map
	}
}
