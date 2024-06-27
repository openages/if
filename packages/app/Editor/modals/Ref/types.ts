import type Model from './model'
import type { DirTree } from '@/types'

export interface IPropsModuleTab {
	module: Model['module']
	onChangeModule: (v: Model['module']) => void
}

export interface IPropsFiles {
	latest_files: Model['latest_files']
	onItem: Model['onItem']
}
export interface IPropsFileItem {
	item: Model['latest_files'][number]
	index: number
	onItem: Model['onItem']
}

export interface IPropsItems {
	latest_items: Model['latest_items']
	onItem: Model['onItem']
}

export interface IPropsItem {
	item: Model['latest_items'][number]
	index: number
	onItem: Model['onItem']
}
