import type { SortableProps } from '@/components'
import type { DirTree, RxDB, Todo } from '@/types'
import type { MenuProps, SelectProps } from 'antd'
import type Model from '../model'

export type QueryItems = RxDB.ItemsQuery<Todo.TodoItem>
export type QueryArchives = RxDB.ItemsQuery<Todo.TodoItem>
export type DragTodoItem = { index: number; dimension_id: string; item: Todo.TodoItem }

export interface IProps {
	id: string
}

export interface IPropsTagSelect {
	options: Model['setting']['setting']['tags']
	value: Array<string>
	useByTodo?: boolean
	useByDetail?: boolean
	kanban_mode?: Model['kanban_mode']
	className?: SelectProps['className']
	placement?: SelectProps['placement']
	onChange?: (v: Array<string>) => void
}

export interface IPropsHeader
	extends Pick<Todo.Setting & DirTree.Item, 'name' | 'icon' | 'icon_hue' | 'desc' | 'tags'> {
	mode: Model['mode']
	kanban_mode: Model['kanban_mode']
	items_sort_param: Model['items_sort_param']
	items_filter_tags: Model['items_filter_tags']
	setMode: Model['setMode']
	toggleKanbanMode: Model['toggleKanbanMode']
	showSettingsModal: () => void
	showArchiveModal: () => void
	showHelpModal: () => void
	setItemsSortParam: (v: Model['items_sort_param']) => void
	setItemsFilterTags: (v: Model['items_filter_tags']) => void
}

export interface IPropsTabs {
	angles: Model['setting']['setting']['angles']
	current_angle_id: Model['current_angle_id']
	setCurrentAngleId: (id: Model['current_angle_id']) => void
}

export interface IPropsTabsItem {
	item: Model['setting']['setting']['angles'][number]
	active: boolean
	setCurrentAngleId: IPropsTabs['setCurrentAngleId']
}

export interface IPropsInput {
	loading: boolean
	tags?: Model['setting']['setting']['tags']
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
	tags: Model['setting']['setting']['tags']
	angles: Model['setting']['setting']['angles']
	relations: Todo.Setting['relations']
	drag_disabled: boolean
	kanban_mode?: Model['kanban_mode']
	dimension_id?: string
	check: Model['check']
	updateRelations: Model['updateRelations']
	insert: Model['insert']
	update: Model['update']
	tab: Model['tab']
	moveTo: Model['moveTo']
	remove: Model['remove']
	showDetailModal: (args: Model['current_detail_index']) => void
}

export interface IPropsTodoItem {
	sortable_props?: SortableProps
	item: Todo.Todo
	index: number
	tags: Model['setting']['setting']['tags']
	angles: Model['setting']['setting']['angles']
	drag_disabled: boolean
	kanban_mode?: Model['kanban_mode']
	dimension_id?: string
	drag_overlay?: boolean
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
	open: Todo.Todo['open']
	isDragging: boolean
	handled: boolean
	useByDetail?: boolean
	dimension_id?: string
	ChildrenContextMenu: MenuProps['items']
	update: Model['update']
	tab: Model['tab']
	insertChildren: (children_index?: number) => Promise<void>
	removeChildren: (children_index: number) => Promise<void>
}

export interface IPropsChildrenItem {
	sortable_props?: SortableProps
	item: Todo.Todo['children'][number]
	index: number
	children_index: number
	useByDetail: IPropsChildren['useByDetail']
	ChildrenContextMenu: IPropsChildren['ChildrenContextMenu']
	dimension_id?: string
	update: (children_index: number, value: Partial<Omit<Todo.Todo['children'][number], 'id'>>) => Promise<void>
	tab: Model['tab']
	insertChildren: (children_index?: number) => Promise<void>
	removeChildren: (children_index: number) => Promise<void>
}

export interface IPropsGroupTitle {
	sortable_props?: SortableProps
	item: Todo.Group
	index: number
	update: Model['update']
	remove: Model['remove']
}

export interface IPropsKanban extends Omit<IPropsTodos, 'items' | 'kanban_mode'> {
	kanban_mode: Model['kanban_mode']
	kanban_items: Model['kanban_items']
}

export interface IPropsSettingsModal {
	visible_settings_modal: Model['visible_settings_modal']
	setting: Model['setting']['setting'] & Model['file']['data']
	closeSettingsModal: () => void
	updateSetting: Model['updateSetting']
	removeAngle: Model['removeAngle']
	removeTag: Model['removeTag']
}

export interface IPropsArchive {
	visible_archive_modal: Model['visible_archive_modal']
	archives: Model['archives']
	archive_counts: Model['archive_counts']
	end: Model['loadmore']['end']
	angles: Model['setting']['setting']['angles']
	tags: Model['setting']['setting']['tags']
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
	relations: Todo.Setting['relations']
	tags: Model['setting']['setting']['tags']
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
