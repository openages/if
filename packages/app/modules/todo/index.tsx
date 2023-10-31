import { useMemoizedFn } from 'ahooks'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState, useMemo } from 'react'
import { Else, If, Then, When } from 'react-if'
import { container } from 'tsyringe'

import { DataEmpty } from '@/components'
import { usePageScrollRestoration } from '@/hooks'
import { isShowEmpty } from '@/utils'

import { Header, Input, Tabs, Todos, SettingsModal, Archive, Detail } from './components'
import styles from './index.css'
import Model from './model'

import type {
	IProps,
	IPropsHeader,
	IPropsTabs,
	IPropsInput,
	IPropsTodos,
	IPropsSettingsModal,
	IPropsArchive,
	IPropsDetail
} from './types'

const Index = ({ id }: IProps) => {
	const [x] = useState(() => container.resolve(Model))
	const angles = toJS(x.todo.angles || [])

	usePageScrollRestoration(id, toJS(x.global.tabs.stacks))

	useLayoutEffect(() => {
		x.init({ id })

		return () => x.off()
	}, [id])

	const props_header: IPropsHeader = {
		name: x.file.data.name,
		icon: x.file.data.icon,
		icon_hue: x.file.data.icon_hue,
		desc: x.todo.desc,
		tags: toJS(x.todo.tags),
		items_sort_param: toJS(x.items_sort_param),
		items_filter_tags: toJS(x.items_filter_tags),
		showSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = true)),
		showArchiveModal: useMemoizedFn(() => (x.visible_archive_modal = true)),
		setItemsSortParam: useMemoizedFn((v) => (x.items_sort_param = v)),
		setItemsFilterTags: useMemoizedFn((v) => (x.items_filter_tags = v))
	}

	const props_tabs: IPropsTabs = {
		angles: toJS(x.todo.angles) || [],
		current_angle_id: x.current_angle_id,
		setCurrentAngleId: useMemoizedFn((v) => (x.current_angle_id = v))
	}

	const props_input: IPropsInput = {
		loading: x.utils.loading['create'],
		tags: toJS(x.todo.tags),
		create: useMemoizedFn(x.create)
	}

	const move_to_angles = useMemo(() => angles.filter((item) => item.id !== x.current_angle_id), [angles])

	const props_todos: IPropsTodos = {
		items: toJS(x.items),
		tags: toJS(x.todo.tags || []),
		angles: move_to_angles,
		relations: toJS(x.todo?.relations || []),
		drag_disabled: x.is_filtered,
		check: useMemoizedFn(x.check),
		updateRelations: useMemoizedFn(x.updateRelations),
		move: useMemoizedFn(x.move),
		insert: useMemoizedFn(x.insert),
		update: useMemoizedFn(x.update),
		tab: useMemoizedFn(x.tab),
		moveTo: useMemoizedFn(x.moveTo),
		remove: useMemoizedFn(x.remove),
		showDetailModal: useMemoizedFn((index: number) => {
			x.visible_detail_modal = true
			x.current_detail_index = index
		})
	}

	const props_settings_modal: IPropsSettingsModal = {
		visible_settings_modal: x.visible_settings_modal,
		todo: { ...toJS(x.todo), ...toJS(x.file.data) },
		closeSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = false)),
		updateTodo: useMemoizedFn(x.updateTodo),
		removeAngle: useMemoizedFn(x.removeAngle),
		removeTag: useMemoizedFn(x.removeTag)
	}

	const props_archive: IPropsArchive = {
		visible_archive_modal: x.visible_archive_modal,
		archives: toJS(x.archives),
		archive_counts: x.archive_counts,
		end: x.loadmore.end,
		angles: toJS(x.todo.angles) || [],
		tags: toJS(x.todo.tags),
		archive_query_params: toJS(x.archive_query_params),
		loadMore: useMemoizedFn(x.loadmore.loadMore),
		onClose: useMemoizedFn(() => (x.visible_archive_modal = false)),
		restoreArchiveItem: useMemoizedFn(x.restoreArchiveItem),
		removeArchiveItem: useMemoizedFn(x.removeArchiveItem),
		archiveByTime: useMemoizedFn(x.archiveByTime),
		setArchiveQueryParams: useMemoizedFn((v) => (x.archive_query_params = v))
	}

	const props_detail: IPropsDetail = {
		visible_detail_modal: x.visible_detail_modal,
		current_detail_index: toJS(x.current_detail_index),
		current_detail_item: toJS(x.current_detail_item),
		update: useMemoizedFn(x.update),
		tab: useMemoizedFn(x.tab),
		closeDetailModal: useMemoizedFn(() => (x.visible_detail_modal = false))
	}

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			<If condition={x.id && x.file.data.name}>
				<Then>
					<Header {...props_header}></Header>
					<Tabs {...props_tabs}></Tabs>
					<Input {...props_input}></Input>
					<Todos {...props_todos}></Todos>
					<SettingsModal {...props_settings_modal}></SettingsModal>
					<Archive {...props_archive}></Archive>
					<Detail {...props_detail}></Detail>
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
