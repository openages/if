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
		x.init(id)

		return () => x.off()
	}, [id])

	const props_header: IPropsHeader = {
		name: x.services.file.data.name,
		icon: x.services.file.data.icon,
		icon_hue: x.services.file.data.icon_hue,
		desc: x.services.info.desc,
		showSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = true)),
		showArchiveModal: useMemoizedFn(() => (x.visible_archive_modal = true))
	}

	const props_tabs: IPropsTabs = {
		angles: toJS(x.services.info.angles) || [],
		current_angle_id: x.services.current_angle_id,
		setCurrentAngleId: useMemoizedFn((v) => (x.services.current_angle_id = v))
	}

	const props_input: IPropsInput = {
		current_angle_id: x.services.current_angle_id,
		loading: x.services.utils.loading['add'],
		tags: toJS(x.services.info.tags),
		add: useMemoizedFn(x.services.add)
	}

	const props_todos: IPropsTodos = {
		items: toJS(x.services.items),
		relations: toJS(x.services.info?.relations || []),
		check: useMemoizedFn(x.check),
		updateRelations: useMemoizedFn(x.updateRelations)
	}

	const props_settings_modal: IPropsSettingsModal = {
		visible_settings_modal: x.visible_settings_modal,
		info: { ...toJS(x.services.info), ...toJS(x.services.file.data) },
		closeSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = false)),
		onInfoChange: useMemoizedFn(x.onInfoChange)
	}

	const props_archive: IPropsArchive = {
		visible_archive_modal: x.visible_archive_modal,
		archives: toJS(x.services.archives),
		archive_counts: x.services.archive_counts,
		end: x.services.loadmore.end,
		restoreArchiveItem: useMemoizedFn(x.services.restoreArchiveItem),
		removeArchiveItem: useMemoizedFn(x.services.removeArchiveItem),
		loadMore: useMemoizedFn(x.services.loadmore.loadMore),
		onClose: useMemoizedFn(() => (x.visible_archive_modal = false))
	}

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			<If condition={x.services.id && x.services.file.data.name}>
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
								x.services.utils.loading['queryFile'] ||
								x.services.utils.loading['query'] ||
								x.services.utils.loading['queryItems']
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
