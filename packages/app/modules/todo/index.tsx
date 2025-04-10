import { useMemoizedFn } from 'ahooks'
import { omit, pick } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useState, Fragment } from 'react'
import { match, P } from 'ts-pattern'
import { container } from 'tsyringe'

import { DataEmpty, SortableWrap } from '@/components'
import { useStackSelector } from '@/context/stack'
import { useStackEffect } from '@/hooks'
import { pointerWithin, rectIntersection, DndContext, DragOverlay } from '@dnd-kit/core'

import {
	Activity,
	Analysis,
	Archive,
	Detail,
	Flat,
	Header,
	Input,
	Kanban,
	Mindmap,
	Quad,
	SettingsModal,
	Table,
	Tabs,
	Todos
} from './components'
import FlatTodoItem from './components/FlatTodoItem'
import KanbanTodoItem from './components/KanbanTodoItem'
import TodoItem from './components/TodoItem'
import styles from './index.css'
import Model from './model'

import type { Todo } from '@/types'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type {
	DragTodoItem,
	IProps,
	IPropsArchive,
	IPropsDetail,
	IPropsHeader,
	IPropsInput,
	IPropsKanban,
	IPropsSettingsModal,
	IPropsTable,
	IPropsTabs,
	IPropsTodoItem,
	IPropsTodos,
	IPropsMindmap,
	IPropsAnalysis,
	IPropsActivity,
	IPropsQuad
} from './types'

const Index = ({ id }: IProps) => {
	const [x] = useState(() => container.resolve(Model))
	const breakpoint = useStackSelector(v => v.breakpoint)
	const [drag_todo_item, setDragTodoItem] = useState<DragTodoItem | null>(null)

	const items = $copy(x.items)
	const angles = $copy(x.setting?.setting?.angles || [])
	const visible_angles = $copy(x.visible_angles)
	const tags = $copy(x.setting?.setting?.tags || [])
	const relations = $copy(x.setting?.setting?.relations || [])
	const current_detail_item = $copy(x.current_detail_item)
	const search_mode = Boolean(x.table_selector.id)
	const table_exclude_fields = $copy(x.setting?.setting?.table_exclude_fields || [])

	const updateSetting = useMemoizedFn(x.updateSetting)

	const { setDom } = useStackEffect({
		mounted: () => x.init({ id }),
		unmounted: () => x.off(),
		deps: [id]
	})

	useEffect(() => {
		if (!Object.keys(current_detail_item).length) {
			x.visible_detail_modal = false
		}
	}, [current_detail_item])

	const props_header: IPropsHeader = {
		mode: x.mode,
		zen_mode: x.zen_mode,
		name: x.file.data.name,
		icon: x.file.data.icon,
		icon_hue: x.file.data.icon_hue,
		desc: x.setting?.setting?.desc,
		tags,
		items_sort_param: $copy(x.items_sort_param),
		items_filter_tags: $copy(x.items_filter_tags),
		search_mode,
		table_exclude_fields,
		setMode: useMemoizedFn(x.setMode),
		toggleZenMode: useMemoizedFn(() => (x.zen_mode = !x.zen_mode)),
		showSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = true)),
		showArchiveModal: useMemoizedFn(() => (x.visible_archive_modal = true)),
		showAnalysisModal: useMemoizedFn(() => {
			x.getAnalysisData()

			x.visible_analysis_modal = true
		}),
		showActivityModal: useMemoizedFn(() => (x.visible_activity_modal = true)),
		setItemsSortParam: useMemoizedFn(v => (x.items_sort_param = v)),
		setItemsFilterTags: useMemoizedFn(v => (x.items_filter_tags = v)),
		toggleTableFilter: useMemoizedFn(() => (x.visible_table_filter = !x.visible_table_filter)),
		resetSearchMode: useMemoizedFn(x.resetSearchMode),
		updateSetting,
		exportToExcel: useMemoizedFn(x.exportToExcel)
	}

	const props_tabs: IPropsTabs = {
		angles: visible_angles,
		current_angle_id: x.current_angle_id,
		setCurrentAngleId: useMemoizedFn(v => (x.current_angle_id = v))
	}

	const props_input: IPropsInput = {
		loading: x.utils.loading['create'],
		tags,
		create: useMemoizedFn(x.create)
	}

	const move_to_angles = useMemo(() => {
		return x.mode === 'list' ? angles.filter(item => item.id !== x.current_angle_id) : angles
	}, [angles, x.mode, x.current_angle_id])

	const props_todos: IPropsTodos = {
		mode: x.mode,
		items,
		angles: move_to_angles,
		tags,
		relations,
		drag_disabled: x.is_filtered,
		zen_mode: x.zen_mode,
		open_items: $copy(x.open_items),
		check: useMemoizedFn(x.check),
		updateRelations: useMemoizedFn(x.updateRelations),
		insert: useMemoizedFn(x.insert),
		update: useMemoizedFn(x.update),
		tab: useMemoizedFn(x.tab),
		moveTo: useMemoizedFn(x.moveTo),
		remove: useMemoizedFn(x.remove),
		handleOpenItem: useMemoizedFn(x.handleOpenItem),
		showDetailModal: useMemoizedFn((args: Model['current_detail_index']) => {
			x.visible_detail_modal = true
			x.current_detail_index = { ...x.current_detail_index, ...args }
		})
	}

	const props_kanban: IPropsKanban = {
		kanban_items: $copy(x.kanban_items),
		...omit(props_todos, ['items'])
	}

	const props_quad: IPropsQuad = {
		quad_items: $copy(x.quad_items),
		...omit(props_todos, ['items'])
	}

	const props_table: IPropsTable = {
		items,
		angles,
		tags,
		table_pagination: $copy(x.table_pagination),
		visible_table_filter: x.visible_table_filter,
		table_exclude_fields,
		clean: useMemoizedFn(x.clean),
		onTableRowChange: useMemoizedFn(x.onTableRowChange),
		onTablePageChange: useMemoizedFn(x.onTablePageChange),
		onTableSortChange: useMemoizedFn(x.onTableSortChange),
		onTableSearch: useMemoizedFn(x.onTableSearch),
		...pick(props_todos, ['relations', 'showDetailModal', 'remove'])
	}

	const props_mindmap: IPropsMindmap = {
		file_id: x.id,
		name: x.file.data?.name,
		kanban_items: $copy(x.kanban_items),
		...omit(props_todos, ['items', 'zen_mode', 'drag_disabled', 'open_items'])
	}

	const props_settings_modal: IPropsSettingsModal = {
		id,
		visible_settings_modal: x.visible_settings_modal,
		setting: { ...$copy(x.setting?.setting), ...$copy(x.file.data) },
		closeSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = false)),
		updateSetting,
		removeAngle: useMemoizedFn(x.removeAngle),
		removeTag: useMemoizedFn(x.removeTag)
	}

	const props_archive: IPropsArchive = {
		visible_archive_modal: x.visible_archive_modal,
		archives: $copy(x.archives),
		archive_counts: x.archive_counts,
		end: x.loadmore.end,
		angles,
		tags,
		archive_query_params: $copy(x.archive_query_params),
		loadMore: useMemoizedFn(x.loadmore.loadMore),
		onClose: useMemoizedFn(() => (x.visible_archive_modal = false)),
		restoreArchiveItem: useMemoizedFn(x.restoreArchiveItem),
		removeArchiveItem: useMemoizedFn(x.removeArchiveItem),
		archiveByTime: useMemoizedFn(x.archiveByTime),
		setArchiveQueryParams: useMemoizedFn(v => (x.archive_query_params = v))
	}

	const props_detail: IPropsDetail = {
		breakpoint,
		mode: x.mode,
		zen_mode: x.zen_mode,
		visible_detail_modal: x.visible_detail_modal,
		current_detail_index: $copy(x.current_detail_index),
		current_detail_item,
		relations,
		angles,
		tags,
		update: useMemoizedFn(x.update),
		tab: useMemoizedFn(x.tab),
		setCurrentDetailIndex: useMemoizedFn(v => (x.current_detail_index = v)),
		closeDetailModal: useMemoizedFn(() => (x.visible_detail_modal = false)),
		clearCurrentDetail: useMemoizedFn((visible: boolean) => {
			if (visible) return

			x.current_detail_index = {} as Model['current_detail_index']
		})
	}

	const props_analysis: IPropsAnalysis = {
		visible_analysis_modal: x.visible_analysis_modal,
		angles,
		tags,
		trending: $copy(x.analysis_trending),
		items: $copy(x.analysis_items),
		analysis_duration: x.analysis_duration,
		analysis_sort_params: $copy(x.analysis_sort_params),
		analysis_filter_angles: $copy(x.analysis_filter_angles),
		analysis_filter_tags: $copy(x.analysis_filter_tags),
		setDuration: useMemoizedFn(v => {
			x.analysis_duration = v

			x.getAnalysisData()
		}),
		setSortParams: useMemoizedFn(v => {
			x.analysis_sort_params = v

			x.getAnalysisData()
		}),
		setFilterAngles: useMemoizedFn(v => {
			x.analysis_filter_angles = v

			x.getAnalysisData()
		}),
		setFilterTags: useMemoizedFn(v => {
			x.analysis_filter_tags = v

			x.getAnalysisData()
		}),
		onClose: useMemoizedFn(() => (x.visible_analysis_modal = false))
	}

	const props_activity: IPropsActivity = {
		id: x.id,
		visible_activity_modal: x.visible_activity_modal,
		onClose: useMemoizedFn(() => (x.visible_activity_modal = false))
	}

	const props_drag_todo_item: IPropsTodoItem = drag_todo_item
		? {
				item: drag_todo_item.item as Todo.Todo,
				index: 0,
				tags,
				angles: props_todos.angles,
				drag_disabled: false,
				zen_mode: props_todos.zen_mode,
				open_items: props_todos.open_items,
				mode: x.mode,
				dimension_id: drag_todo_item.dimension_id,
				drag_overlay: true,
				makeLinkLine: () => {},
				renderLines: () => {},
				check: props_todos.check,
				updateRelations: props_todos.updateRelations,
				insert: props_todos.insert,
				update: props_todos.update,
				tab: props_todos.tab,
				moveTo: props_todos.moveTo,
				remove: props_todos.remove,
				handleOpenItem: props_todos.handleOpenItem,
				showDetailModal: props_todos.showDetailModal
			}
		: ({} as IPropsTodoItem)

	const onDragStart = useMemoizedFn(({ active }: DragStartEvent) => {
		if (x.mode === 'list') return

		const active_index = active.data.current!.index
		const dimension_id = active.data.current!.dimension_id

		setDragTodoItem({
			index: active_index,
			dimension_id,
			item: $copy(x.kanban_items[dimension_id].items[active_index])
		})
	})

	const onDragEnd = useMemoizedFn(({ active, over }: DragEndEvent) => {
		setDragTodoItem(null)

		if (!over?.id) return

		x.move({
			active: { index: active.data.current!.index, dimension_id: active.data.current!.dimension_id },
			over: { index: over.data.current!.index, dimension_id: over.data.current!.dimension_id }
		})
	})

	return (
		<div
			className={$cx(
				'w_100 border_box flex flex_column',
				styles._local,
				x.mode !== 'list' && styles.other_mode,
				!breakpoint && !x.zen_mode && x.visible_detail_modal && styles.visible_detail_modal
			)}
			ref={setDom}
		>
			<DataEmpty></DataEmpty>
			{match(id && x.file.data.name && Boolean(angles))
				.with(true, () => (
					<Fragment>
						<Header {...props_header}></Header>
						{match(x.mode)
							.with(P.union('list', 'kanban', 'flat', 'quad'), () => (
								<DndContext
									collisionDetection={
										x.mode === 'kanban' || x.mode === 'quad'
											? pointerWithin
											: rectIntersection
									}
									onDragStart={onDragStart}
									onDragEnd={onDragEnd}
								>
									{match(x.mode)
										.with('list', () => (
											<Fragment>
												<Tabs {...props_tabs}></Tabs>
												<Todos {...props_todos}></Todos>
												<Input {...props_input}></Input>
											</Fragment>
										))
										.with('kanban', () => <Kanban {...props_kanban}></Kanban>)
										.with('quad', () => <Quad {...props_quad}></Quad>)
										.with('flat', () => <Flat {...props_kanban}></Flat>)
										.otherwise(() => null)}
									{(x.mode === 'kanban' ||
										x.mode === 'flat' ||
										x.mode === 'quad') && (
										<DragOverlay dropAnimation={null}>
											{drag_todo_item && (
												<SortableWrap
													id={drag_todo_item.item.id}
													data={{
														index: drag_todo_item.index,
														dimension_id:
															drag_todo_item.dimension_id
													}}
												>
													<Choose>
														<When condition={x.mode === 'flat'}>
															<FlatTodoItem
																{...props_drag_todo_item}
															></FlatTodoItem>
														</When>
														<When
															condition={
																x.mode === 'kanban'
															}
														>
															<KanbanTodoItem
																{...props_drag_todo_item}
															></KanbanTodoItem>
														</When>
														<Otherwise>
															<TodoItem
																{...props_drag_todo_item}
															></TodoItem>
														</Otherwise>
													</Choose>
												</SortableWrap>
											)}
										</DragOverlay>
									)}
								</DndContext>
							))
							.with('table', () => <Table {...props_table}></Table>)
							.with('mindmap', () => <Mindmap {...props_mindmap}></Mindmap>)
							.exhaustive()}
						<SettingsModal {...props_settings_modal}></SettingsModal>
						<Archive {...props_archive}></Archive>
						<Detail {...props_detail}></Detail>
						<Analysis {...props_analysis}></Analysis>
						<Activity {...props_activity}></Activity>
					</Fragment>
				))
				.otherwise(() => null)}
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
