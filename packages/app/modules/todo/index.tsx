import { DataEmpty } from '@/components'
import { useStack } from '@/context/stack'
import { isShowEmpty } from '@/utils'
import { useMemoizedFn } from 'ahooks'
import { omit } from 'lodash-es'

import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useMemo, useState } from 'react'
import { Case, Else, If, Switch, Then, When } from 'react-if'
import { container } from 'tsyringe'

import { Archive, Detail, Header, Help, Input, Kanban, SettingsModal, Tabs, Todos } from './components'
import styles from './index.css'
import Model from './model'

import type {
	IProps,
	IPropsArchive,
	IPropsDetail,
	IPropsHeader,
	IPropsHelp,
	IPropsInput,
	IPropsKanban,
	IPropsSettingsModal,
	IPropsTabs,
	IPropsTodos
} from './types'

const Index = ({ id }: IProps) => {
	const [x] = useState(() => container.resolve(Model))
	const angles = $copy(x.todo.angles || [])
	const { breakpoint } = useStack()

	useLayoutEffect(() => {
		x.init({ id })

		return () => x.off()
	}, [id])

	const props_header: IPropsHeader = {
		mode: x.mode,
		kanban_mode: x.kanban_mode,
		name: x.file.data.name,
		icon: x.file.data.icon,
		icon_hue: x.file.data.icon_hue,
		desc: x.todo.desc,
		tags: $copy(x.todo.tags),
		items_sort_param: $copy(x.items_sort_param),
		items_filter_tags: $copy(x.items_filter_tags),
		setMode: useMemoizedFn(x.setMode),
		toggleKanbanMode: useMemoizedFn(x.toggleKanbanMode),
		showSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = true)),
		showArchiveModal: useMemoizedFn(() => (x.visible_archive_modal = true)),
		showHelpModal: useMemoizedFn(() => (x.visible_help_modal = true)),
		setItemsSortParam: useMemoizedFn(v => (x.items_sort_param = v)),
		setItemsFilterTags: useMemoizedFn(v => (x.items_filter_tags = v))
	}

	const props_tabs: IPropsTabs = {
		angles: $copy(x.todo.angles) || [],
		current_angle_id: x.current_angle_id,
		setCurrentAngleId: useMemoizedFn(v => (x.current_angle_id = v))
	}

	const props_input: IPropsInput = {
		loading: x.utils.loading['create'],
		tags: $copy(x.todo.tags),
		create: useMemoizedFn(x.create)
	}

	const move_to_angles = useMemo(() => angles.filter(item => item.id !== x.current_angle_id), [angles])

	const props_todos: IPropsTodos = {
		items: $copy(x.items),
		tags: $copy(x.todo.tags || []),
		angles: move_to_angles,
		relations: $copy(x.todo?.relations || []),
		drag_disabled: x.is_filtered,
		check: useMemoizedFn(x.check),
		updateRelations: useMemoizedFn(x.updateRelations),
		move: useMemoizedFn(x.move),
		insert: useMemoizedFn(x.insert),
		update: useMemoizedFn(x.update),
		tab: useMemoizedFn(x.tab),
		moveTo: useMemoizedFn(x.moveTo),
		remove: useMemoizedFn(x.remove),
		showDetailModal: useMemoizedFn((args: Model['current_detail_index']) => {
			x.visible_detail_modal = true
			x.current_detail_index = { ...x.current_detail_index, ...args }
		})
	}

	const props_kanban: IPropsKanban = {
		kanban_mode: x.kanban_mode,
		kanban_items: $copy(x.kanban_items),
		...omit(props_todos, ['items', 'kanban_mode'])
	}

	const props_settings_modal: IPropsSettingsModal = {
		visible_settings_modal: x.visible_settings_modal,
		todo: { ...$copy(x.todo), ...$copy(x.file.data) },
		closeSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = false)),
		updateTodo: useMemoizedFn(x.updateTodo),
		removeAngle: useMemoizedFn(x.removeAngle),
		removeTag: useMemoizedFn(x.removeTag)
	}

	const props_archive: IPropsArchive = {
		visible_archive_modal: x.visible_archive_modal,
		archives: $copy(x.archives),
		archive_counts: x.archive_counts,
		end: x.loadmore.end,
		angles: $copy(x.todo.angles) || [],
		tags: $copy(x.todo.tags),
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
		visible_detail_modal: x.visible_detail_modal,
		current_detail_index: $copy(x.current_detail_index),
		current_detail_item: $copy(x.current_detail_item),
		relations: $copy(x.todo?.relations || []),
		tags: $copy(x.todo.tags),
		update: useMemoizedFn(x.update),
		tab: useMemoizedFn(x.tab),
		setCurrentDetailIndex: useMemoizedFn(v => (x.current_detail_index = v)),
		closeDetailModal: useMemoizedFn(() => (x.visible_detail_modal = false)),
		clearCurrentDetail: useMemoizedFn((visible: boolean) => {
			if (visible) return

			x.current_detail_index = {} as Model['current_detail_index']
		})
	}

	const props_help: IPropsHelp = {
		visible_help_modal: x.visible_help_modal,
		closeHelpModal: useMemoizedFn(() => (x.visible_help_modal = false))
	}

	return (
		<div
			className={$cx(
				'w_100 border_box flex flex_column',
				styles._local,
				x.mode !== 'list' && styles.other_mode,
				!breakpoint && x.visible_detail_modal && styles.visible_detail_modal
			)}
		>
			<If condition={x.id && x.file.data.name}>
				<Then>
					<Header {...props_header}></Header>
					<Switch>
						<Case condition={x.mode === 'list'}>
							<Tabs {...props_tabs}></Tabs>
							<Todos {...props_todos}></Todos>
							<Input {...props_input}></Input>
						</Case>
						<Case condition={x.mode === 'kanban'}>
							<Kanban {...props_kanban}></Kanban>
						</Case>
					</Switch>
					<SettingsModal {...props_settings_modal}></SettingsModal>
					<Archive {...props_archive}></Archive>
					<Detail {...props_detail}></Detail>
					<Help {...props_help}></Help>
				</Then>
				<Else>
					<When
						condition={isShowEmpty([
							x.file.loading,
							x.utils.loading['queryTodo'],
							x.utils.loading['queryItems']
						])}
					>
						<DataEmpty></DataEmpty>
					</When>
				</Else>
			</If>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
