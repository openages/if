import { useMemoizedFn } from 'ahooks'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { Else, If, Then, When } from 'react-if'
import { container } from 'tsyringe'

import { DataEmpty } from '@/components'
import { usePageScrollRestoration } from '@/hooks'

import { Header, Input, Tabs, Todos, SettingsModal, Archive } from './components'
import styles from './index.css'
import Model from './model'

import type {
	IProps,
	IPropsHeader,
	IPropsTabs,
	IPropsInput,
	IPropsTodos,
	IPropsSettingsModal,
	IPropsArchive
} from './types'

const Index = ({ id }: IProps) => {
	const [x] = useState(() => container.resolve(Model))

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
		showSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = true)),
		showArchiveModal: useMemoizedFn(() => (x.visible_archive_modal = true))
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

	const props_todos: IPropsTodos = {
		items: toJS(x.items),
		relations: toJS(x.todo?.relations || []),
		check: useMemoizedFn(x.check),
            updateRelations: useMemoizedFn(x.updateRelations),
		move: useMemoizedFn(x.move),
	}

	const props_settings_modal: IPropsSettingsModal = {
		visible_settings_modal: x.visible_settings_modal,
		todo: { ...toJS(x.todo), ...toJS(x.file.data) },
		closeSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = false)),
		updateTodo: useMemoizedFn(x.updateTodo)
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
				</Then>
				<Else>
					<When
						condition={
							!(
								x.file.loading ||
								x.utils.loading['queryTodo'] ||
								x.utils.loading['queryItems']
							)
						}
					>
						<DataEmpty></DataEmpty>
					</When>
				</Else>
			</If>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
