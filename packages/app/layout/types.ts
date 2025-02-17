import type { GlobalModel } from '@/context/app'
import type { App, DirTree } from '@/types'

export interface IPropsSidebar {
	current_module: App.ModuleType
	blur: GlobalModel['layout']['blur']
	theme: GlobalModel['setting']['theme']
	show_bar_title: GlobalModel['setting']['show_bar_title']
	apps: GlobalModel['app']['apps']
	actives: GlobalModel['app']['actives']
	showSetting: () => void
}

export interface IPropsSidebarItem {
	current_module: App.ModuleType
	theme: GlobalModel['setting']['theme']
	show_bar_title: GlobalModel['setting']['show_bar_title']
	item: App.Module
	active: boolean
}

export interface IPropsStacks {
	columns: GlobalModel['stack']['columns']
	focus: GlobalModel['stack']['focus']
	container_width: GlobalModel['stack']['container_width']
	resizing: GlobalModel['stack']['resizing']
	browser_mode: GlobalModel['setting']['browser_mode']
	click: GlobalModel['stack']['click']
	remove: GlobalModel['stack']['remove']
	update: GlobalModel['stack']['update']
	move: GlobalModel['stack']['move']
	resize: GlobalModel['stack']['resize']
	setResizing: (v: boolean) => boolean
	observe: GlobalModel['stack']['observe']
	unobserve: GlobalModel['stack']['unobserve']
	showHomepage: () => void
}

export interface IPropsStacksNavBar
	extends Omit<
		IPropsStacks,
		| 'visible'
		| 'current_module'
		| 'container_width'
		| 'move'
		| 'resize'
		| 'setResizing'
		| 'observe'
		| 'unobserve'
	> {
	resizing: boolean
}

export interface IPropsStacksNavBarColumn extends Omit<IPropsStacksNavBar, 'columns' | 'browser_mode' | 'move'> {
	column_index: number
	show_homepage_btn?: boolean
	column_is_last?: boolean
	column: IPropsStacksNavBar['columns'][number]
}

export interface IPropsStacksNavBarView
	extends Omit<IPropsStacksNavBarColumn, 'column' | 'move' | 'resizing' | 'showHomepage'> {
	view_index: number
	view: IPropsStacksNavBar['columns'][number]['views'][number]
	drag_overlay?: boolean
}

export interface IPropsStacksContent
	extends Pick<IPropsStacks, 'columns' | 'container_width' | 'click' | 'resize' | 'setResizing'> {
	resizing: boolean
}

export interface IPropsStacksContentDrop {
	column_index: number
	direction: 'left' | 'right'
}

export interface IPropsStacksContentColumn {
	column_index: number
	column: IPropsStacksNavBar['columns'][number]
	width: number
	container_width: IPropsStacksContent['container_width']
	resizing: IPropsStacksContent['resizing']
	click: IPropsStacksContent['click']
	resize: IPropsStacksContent['resize']
	setResizing: IPropsStacksContent['setResizing']
}

export interface IPropsStacksContentView {
	column_index: number
	view_index: number
	view: IPropsStacksNavBar['columns'][number]['views'][number]
	width: number
	container_width: IPropsStacksContent['container_width']
	click: IPropsStacksContent['click']
}

export interface IPropsStacksView {
	column_index: number
	view_index: number
	module: App.ModuleType
	id: string
	width: number
	container_width: IPropsStacksContent['container_width']
	click: IPropsStacksContent['click']
}

export interface IPropsAppMenu {
	visible: GlobalModel['app']['visible_app_menu']
	app_modules: GlobalModel['app']['app_modules']
	actives: GlobalModel['app']['actives']
	visible_dirtree: boolean
	onClose: () => void
}

export interface IPropsAppSwitch {
	visible: GlobalModel['app']['visible_app_switch']
	actives: GlobalModel['app']['actives']
	switch_index: GlobalModel['app']['switch_index']
	changeSwitchIndex: GlobalModel['app']['changeSwitchIndex']
	handleAppSwitch: GlobalModel['app']['handleAppSwitch']
	onClose: () => void
}

export interface IPropsSearch {
	current_module: App.ModuleType
	apps: Array<App.ModuleType>
	open: GlobalModel['search']['open']
	module: GlobalModel['search']['module']
	items: GlobalModel['search']['items']
	index: GlobalModel['search']['index']
	history: GlobalModel['search']['history']
	setModule: (v: IPropsSearch['module']) => void
	searchByInput: GlobalModel['search']['searchByInput']
	onClose: GlobalModel['search']['closeSearch']
	onCheck: GlobalModel['search']['onCheck']
	changeSearchIndex: (index: number) => void
	clearSearchHistory: () => void
}

export interface IPropsSetting {
	visible: GlobalModel['setting']['visible']
	onClose: () => void
}

export interface IPropsHomepage {
	visible_homepage: GlobalModel['app']['visible_homepage']
	tab: GlobalModel['app']['homepage_tab']
	active: GlobalModel['app']['homepage_active']
	apps: GlobalModel['app']['apps']
	latest_files: GlobalModel['app']['latest_files']
	star_files: GlobalModel['app']['star_files']
	setTab: (v: IPropsHomepage['tab']) => void
	setActive: (v: IPropsHomepage['active']) => void
	showSetting: () => void
	closeHomepage: () => void
	setStar: GlobalModel['app']['setStar']
	onFile: (file: DirTree.Item) => void
}

export interface IPropsHomepageHeader
	extends Pick<IPropsHomepage, 'tab' | 'setTab' | 'showSetting' | 'closeHomepage'> {}

export interface IPropsHomepageFiles extends Pick<IPropsHomepage, 'tab' | 'setStar' | 'onFile'> {
	files: DirTree.Items
}

export interface IPropsHomepageApps extends Pick<IPropsHomepage, 'apps'> {
	active: App.ModuleType
	setActive: (v: IPropsHomepageApps['active']) => void
}

export interface IPropsHomepageDirtree {
	active: App.ModuleType
}
