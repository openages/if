import { useMemoizedFn } from 'ahooks'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { Else, If, Then } from 'react-if'
import { container } from 'tsyringe'

import { DataEmpty } from '@/components'
import { usePageScrollRestoration } from '@/hooks'

import { Header, Input, Tabs, Todos, SettingsModal } from './components'
import styles from './index.css'
import Model from './model'

import type { IProps, IPropsHeader, IPropsTabs, IPropsTodos, IPropsSettingsModal } from './types'

const Index = ({ id }: IProps) => {
	const [x] = useState(() => container.resolve(Model))

	usePageScrollRestoration(id, toJS(x.global.tabs.stacks))

	useLayoutEffect(() => {
		x.services.id = id

		x.init()

		return () => x.off()
	}, [id])

	const props_header: IPropsHeader = {
		name: x.services.info.name,
		icon: x.services.info.icon,
		desc: x.services.info.desc,
		showSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = true))
	}

	const props_tabs: IPropsTabs = {
		angles: toJS(x.services.info.angles),
		angle_index: x.services.angle_index,
		setCurrentAngle: useMemoizedFn((v: number) => (x.services.angle_index = v))
	}

	const props_todos: IPropsTodos = {
		items: toJS(x.services.items)
	}

	const props_settings_modal: IPropsSettingsModal = {
		visible_settings_modal: x.visible_settings_modal,
		info: toJS(x.services.info),
		closeSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = false)),
		onInfoChange: useMemoizedFn(x.onInfoChange)
	}

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			<If condition={x.services.id && x.services.info?.name}>
				<Then>
					<Header {...props_header}></Header>
					<Tabs {...props_tabs}></Tabs>
					<Todos {...props_todos}></Todos>
					<Input></Input>
					<SettingsModal {...props_settings_modal}></SettingsModal>
				</Then>
				<Else>
					<DataEmpty></DataEmpty>
				</Else>
			</If>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
