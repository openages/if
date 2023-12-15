import type { DirTree, RxDB, Todo } from '@/types'
import type { MenuProps, SelectProps } from 'antd'
import type Model from '../model'

export type QueryItems = RxDB.ItemsQuery<Todo.TodoItem>
export type QueryArchives = RxDB.ItemsQuery<Todo.TodoItem>

export interface IProps {
	id: string
}

export interface IPropsTagSelect {
	options: Model['todo']['tags']
	value: Array<string>
	useByTodo?: boolean
	useByDetail?: boolean
	className?: SelectProps['className']
	placement?: SelectProps['placement']
	onChange?: (v: Array<string>) => void
}

export interface IPropsHeader extends Pick<Todo.Data & DirTree.Item, 'name' | 'icon' | 'icon_hue' | 'desc' | 'tags'> {
	items_sort_param: Model['items_sort_param']
	items_filter_tags: Model['items_filter_tags']
	showSettingsModal: () => void
	showArchiveModal: () => void
	showHelpModal: () => void
	setItemsSortParam: (v: Model['items_sort_param']) => void
	setItemsFilterTags: (v: Model['items_filter_tags']) => void
}

export interface IPropsSettingsModal {
	visible_settings_modal: Model['visible_settings_modal']
	todo: Model['todo'] & Model['file']['data']
	closeSettingsModal: () => void
	updateTodo: Model['updateTodo']
	removeAngle: Model['removeAngle']
	removeTag: Model['removeTag']
}

export interface IPropsTabs {
	angles: Model['todo']['angles']
	current_angle_id: Model['current_angle_id']
	setCurrentAngleId: (id: Model['current_angle_id']) => void
}

export interface IPropsTabsItem {
	item: Model['todo']['angles'][number]
	active: boolean
	setCurrentAngleId: IPropsTabs['setCurrentAngleId']
}

export interface IPropsInput {
	loading: boolean
	tags?: Model['todo']['tags']
	create: Model['create']
}

export interface IPropsStar {
	value: Todo.Todo['star']
	onChangeStar: (v: Todo.Todo['star']) => void
}

export interface IPropsRemind {
	remind_time: Todo.Todo['remind_time']
	useByDetail?: boolean
	onChangeRemind: (v: Todo.Todo['remind_time']) => void
}

export interface IPropsRemindStatus {
	remind_time: Todo.Todo['remind_time']
	useByArchive?: boolean
}

export interface IPropsCircle {
	cycle_enabled: Todo.Todo['cycle_enabled']
	cycle: Todo.Todo['cycle']
	useByDetail?: boolean
	onChangeCircle: (args: Partial<Pick<IPropsCircle, 'cycle_enabled' | 'cycle'>>) => void
}

export interface IPropsCircleStatus {
	cycle: Todo.Todo['cycle']
	recycle_time: Todo.Todo['recycle_time']
	useByArchive?: boolean
}

export interface IPropsTodos {
	items: Model['items']
	tags: Model['todo']['tags']
	angles: Model['todo']['angles']
	relations: Todo.Data['relations']
	drag_disabled: boolean
	check: Model['check']
	updateRelations: Model['updateRelations']
	move: Model['move']
	insert: Model['insert']
	update: Model['update']
	tab: Model['tab']
	moveTo: Model['moveTo']
	remove: Model['remove']
	showDetailModal: (index: number) => void
}

export interface IPropsTodoItem {
	item: Todo.Todo
	index: number
	tags: Model['todo']['tags']
	angles: Model['todo']['angles']
	drag_disabled: boolean
	makeLinkLine: (args: { active_id: string; y: number } | null) => void
	renderLines: (id: string) => void
	check: Model['check']
	updateRelations: Model['updateRelations']
	insert: Model['insert']
	update: Model['update']
	tab: Model['tab']
	moveTo: Model['moveTo']
	remove: Model['remove']
	showDetailModal: IPropsTodos['showDetailModal']
}

export interface IPropsChildren {
	items: Todo.Todo['children']
	index: number
	fold: boolean
	isDragging: boolean
	handled: boolean
	useByDetail?: boolean
	ChildrenContextMenu: MenuProps['items']
	update: Model['update']
	tab: Model['tab']
	insertChildren: (children_index?: number) => Promise<void>
	removeChildren: (children_index: number) => Promise<void>
}

export interface IPropsChildrenItem {
	item: Todo.Todo['children'][number]
	index: number
	children_index: number
	useByDetail: IPropsChildren['useByDetail']
	ChildrenContextMenu: IPropsChildren['ChildrenContextMenu']
	update: (children_index: number, value: Partial<Omit<Todo.Todo['children'][number], 'id'>>) => Promise<void>
	tab: Model['tab']
	insertChildren: (children_index?: number) => Promise<void>
	removeChildren: (children_index: number) => Promise<void>
}

export interface IPropsGroupTitle {
	item: Todo.Group
	index: number
	update: Model['update']
	remove: Model['remove']
}

export interface IPropsArchive {
	visible_archive_modal: Model['visible_archive_modal']
	archives: Model['archives']
	archive_counts: Model['archive_counts']
	end: Model['loadmore']['end']
	angles: Model['todo']['angles']
	tags: Model['todo']['tags']
	archive_query_params: Model['archive_query_params']
	loadMore: () => void
	onClose: () => void
	restoreArchiveItem: Model['restoreArchiveItem']
	removeArchiveItem: Model['removeArchiveItem']
	archiveByTime: Model['archiveByTime']
	setArchiveQueryParams: (v: Model['archive_query_params']) => void
}

export interface IPropsArchiveItem extends Pick<IPropsArchive, 'restoreArchiveItem' | 'removeArchiveItem'> {
	item: Todo.Todo
}

export interface IPropsDetail {
	breakpoint?: number
	visible_detail_modal: Model['visible_detail_modal']
	current_detail_index: Model['current_detail_index']
	current_detail_item: Model['current_detail_item']
	relations: Todo.Data['relations']
	tags: Model['todo']['tags']
	next: boolean
	update: Model['update']
	tab: Model['tab']
	setCurrentDetailIndex: (v: Model['current_detail_index']) => void
	closeDetailModal: () => void
	clearCurrentDetail: (visible: boolean) => void
}

export interface IPropsDetailRemark {
	remark: Todo.Todo['remark']
	updateRemark: (v: Todo.Todo['remark']) => void
}

export interface IPropsHelp {
	visible_help_modal: Model['visible_help_modal']
	closeHelpModal: () => void
}
