import type { DirTree, RxDB, Todo, DndItemProps } from '@/types'
import type { SelectProps } from 'antd'
import type Model from '../model'
import type { Icon } from '@phosphor-icons/react'
import type { RefObject } from 'react'

export type QueryItems = RxDB.ItemsQuery<Todo.TodoItem>
export type QueryArchives = RxDB.ItemsQuery<Todo.TodoItem>
export type DragTodoItem = { index: number; dimension_id: string; item: Todo.TodoItem }

export interface IProps {
	id: string
}

export interface IPropsTagSelect {
	options: Model['setting']['setting']['tags']
	value: Array<string>
	className?: SelectProps['className']
	placement?: SelectProps['placement']
	unlimit?: boolean
	wrap?: boolean
	show_suffix?: boolean
	useByTodo?: boolean
	useByInput?: boolean
	useByTable?: boolean
	useByKanban?: boolean
	onChange?: (v: Array<string>) => void
	onFocus?: (v: boolean) => void
}

export interface IPropsHeader
	extends Pick<Todo.Setting & DirTree.Item, 'name' | 'icon' | 'icon_hue' | 'desc' | 'tags'> {
	mode: Model['mode']
	zen_mode: Model['zen_mode']
	items_sort_param: Model['items_sort_param']
	items_filter_tags: Model['items_filter_tags']
	search_mode: boolean
	table_exclude_fields: Array<string>
	setMode: Model['setMode']
	toggleZenMode: () => void
	showSettingsModal: () => void
	showArchiveModal: () => void
	showAnalysisModal: () => void
	showActivityModal: () => void
	setItemsSortParam: (v: Model['items_sort_param']) => void
	setItemsFilterTags: (v: Model['items_filter_tags']) => void
	toggleTableFilter: () => void
	resetSearchMode: Model['resetSearchMode']
	updateSetting: Model['updateSetting']
}

export interface IPropsHeaderTableFields extends Pick<IPropsHeader, 'table_exclude_fields' | 'updateSetting'> {}

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

export interface IPropsLevel {
	value: Todo.Todo['level']
	useByInput?: boolean
	onChangeLevel: (v: Todo.Todo['level']) => void
	onFocus?: () => void
	onBlur?: () => void
}

export interface IPropsLevelStatus {
	level: Todo.Todo['level']
}

export interface IPropsDateTime {
	value: number
	Icon?: Icon
	useByDetail?: boolean
	ignoreDetail?: boolean
	onFocus?: (v: boolean) => void
	onChange: (v: number) => void
}

export interface IPropsRemindStatus {
	remind_time: Todo.Todo['remind_time']
	useByFlat?: boolean
}

export interface IPropsDeadlineStatus {
	end_time: Todo.Todo['end_time']
	useByFlat?: boolean
}

export interface IPropsCircle {
	cycle_enabled: Todo.Todo['cycle_enabled']
	cycle: Todo.Todo['cycle']
	useByDetail?: boolean
	unEditing?: boolean
	onFocus?: (v?: boolean) => void
	onChange: (v: Todo.Todo['cycle']) => void
	onChangeItem: (v: any) => void
}

export interface IPropsCircleStatus {
	cycle: Todo.Todo['cycle']
	recycle_time: Todo.Todo['recycle_time']
	useByFlat?: boolean
}

export interface IPropsTodos {
	mode: Model['mode']
	items: Model['items']
	tags: Model['setting']['setting']['tags']
	angles: Model['setting']['setting']['angles']
	relations: Todo.Setting['relations']
	drag_disabled: boolean
	zen_mode: Model['zen_mode']
	open_items: Model['open_items']
	dimension_id?: string
	check: Model['check']
	updateRelations: Model['updateRelations']
	insert: Model['insert']
	update: Model['update']
	tab: Model['tab']
	moveTo: Model['moveTo']
	remove: Model['remove']
	handleOpenItem: Model['handleOpenItem']
	showDetailModal: (args: Model['current_detail_index']) => void
}

export interface IPropsFlatTodos extends IPropsTodos {
	scroll_container: RefObject<HTMLDivElement>
	angle: Todo.Angle
}

export interface IPropsTodoItem {
	mode: Model['mode']
	sortable_props?: DndItemProps
	item: Todo.Todo
	index: number
	angles: Model['setting']['setting']['angles']
	tags: Model['setting']['setting']['tags']
	drag_disabled?: boolean
	zen_mode?: Model['zen_mode']
	open_items?: Model['open_items']
	dimension_id?: string
	drag_overlay?: boolean
	useByMindmap?: boolean
	data?: Omit<IPropsTodoItem, 'data'>
	makeLinkLine?: (args: { active_id: string; y: number } | null) => void
	renderLines?: () => void
	check: Model['check']
	updateRelations?: Model['updateRelations']
	insert: Model['insert']
	update: Model['update']
	tab: Model['tab']
	moveTo: Model['moveTo']
	remove: Model['remove']
	handleOpenItem?: Model['handleOpenItem']
	showDetailModal: IPropsTodos['showDetailModal']
}

export interface IPropsFlatTodoItem extends IPropsTodoItem {
	serial?: string
}

export interface IPropsQuadTodoItem extends IPropsTodoItem {}

export interface IPropsChildren {
	mode: Model['mode']
	items: Todo.Todo['children']
	index: number
	open: boolean
	isDragging?: boolean
	handled?: boolean
	dimension_id?: string
	useByDetail?: boolean
	update: Model['update']
	tab: Model['tab']
}

export interface IPropsChildrenItem {
	sortable_props?: DndItemProps
	item: Required<Todo.Todo>['children'][number]
	index: number
	children_index: number
	dimension_id?: string
	mode?: Model['mode']
	useByDetail: IPropsChildren['useByDetail']
	useByMindmap?: boolean
	update: Model['update']
	tab: Model['tab']
}

export interface IPropsGroupTitle {
	sortable_props?: DndItemProps
	item: Todo.Group
	index: number
	update: Model['update']
	remove: Model['remove']
}

export interface IPropsKanban extends Omit<IPropsTodos, 'items'> {
	kanban_items: Model['kanban_items']
}

export interface IPropsQuad extends Omit<IPropsTodos, 'items'> {
	quad_items: Model['quad_items']
}

export interface IPropsTable extends Pick<IPropsTodos, 'relations' | 'showDetailModal' | 'remove'> {
	items: Model['items']
	angles: Model['setting']['setting']['angles']
	tags: Model['setting']['setting']['tags']
	table_pagination: Model['table_pagination']
	visible_table_filter: Model['visible_table_filter']
	table_exclude_fields: Array<string>
	clean: Model['clean']
	onTableRowChange: Model['onTableRowChange']
	onTablePageChange: Model['onTablePageChange']
	onTableSortChange: Model['onTableSortChange']
	onTableSearch: Model['onTableSearch']
}

export interface IPropsTableFilter {
	visible_table_filter: Model['visible_table_filter']
	angles: Model['setting']['setting']['angles']
	tags: Model['setting']['setting']['tags']
	onTableSearch: Model['onTableSearch']
}

export interface IPropsMindmap
	extends Omit<
		IPropsTodos,
		'items' | 'zen_mode' | 'drag_disabled' | 'open_items' | 'relations' | 'updateRelations' | 'handleOpenItem'
	> {
	file_id: Model['id']
	name: Model['file']['data']['name']
	kanban_items: Model['kanban_items']
}

export interface IPropsSettingsModal {
	id: Model['id']
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
	mode: Model['mode']
	zen_mode: Model['zen_mode']
	visible_detail_modal: Model['visible_detail_modal']
	current_detail_index: Model['current_detail_index']
	current_detail_item: Model['current_detail_item']
	relations: Todo.Setting['relations']
	angles: Model['setting']['setting']['angles']
	tags: Model['setting']['setting']['tags']
	update: Model['update']
	tab: Model['tab']
	setCurrentDetailIndex: (v: Model['current_detail_index']) => void
	closeDetailModal: () => void
	clearCurrentDetail: (visible: boolean) => void
}

export interface IPropsDetailRemark {
	remark: Todo.Todo['remark']
	in_modal?: boolean
	updateRemark: (v: Todo.Todo['remark']) => void
}

export interface IPropsAnalysis {
	visible_analysis_modal: Model['visible_analysis_modal']
	angles: Model['setting']['setting']['angles']
	tags: Model['setting']['setting']['tags']
	trending: Model['analysis_trending']
	items: Model['analysis_items']
	analysis_duration: Model['analysis_duration']
	analysis_sort_params: Model['analysis_sort_params']
	analysis_filter_angles: Model['analysis_filter_angles']
	analysis_filter_tags: Model['analysis_filter_tags']
	setDuration: (v: Model['analysis_duration']) => void
	setSortParams: (v: Model['analysis_sort_params']) => void
	setFilterAngles: (v: Model['analysis_filter_angles']) => void
	setFilterTags: (v: Model['analysis_filter_tags']) => void
	onClose: () => void
}

export interface IPropsAnalysisDuration {
	analysis_duration: Model['analysis_duration']
	total: number
	setDuration: (v: Model['analysis_duration']) => void
}

export interface IPropsAnalysisChart {
	trending: Model['analysis_trending']
}

export interface IPropsAnalysisListHeader {
	angles: Model['setting']['setting']['angles']
	tags: Model['setting']['setting']['tags']
	analysis_sort_params: Model['analysis_sort_params']
	analysis_filter_angles: Model['analysis_filter_angles']
	analysis_filter_tags: Model['analysis_filter_tags']
	group_by: 'angle' | 'tag' | null
	setSortParams: (v: Model['analysis_sort_params']) => void
	setFilterAngles: (v: Model['analysis_filter_angles']) => void
	setFilterTags: (v: Model['analysis_filter_tags']) => void
	setGroupBy: (v: 'angle' | 'tag' | null) => void
}

export interface IPropsAnalysisList {
	data: string
}

export interface IPropsAnalysisExport {
	prefix: string
	disabled: boolean
	setPrefix: (v: string) => void
	exportTodos: (type: 'text' | 'json') => void
	copyToClipboard: () => void
}

export interface IPropsActivity {
	id: Model['id']
	visible_activity_modal: Model['visible_activity_modal']
	onClose: () => void
}
