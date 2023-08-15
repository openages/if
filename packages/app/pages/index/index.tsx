import { useMemoizedFn } from 'ahooks'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { Else, If, Then } from 'react-if'
import { container } from 'tsyringe'

import { getRefs, add, remove, update } from '@/actions/todo'
import { DataEmpty, DirTree } from '@/components'

import { Header, Input, Tabs, Todos, SettingsModal } from './components'
import styles from './index.css'
import Model from './model'

import type { IPropsDirTree } from '@/components'
import type { IPropsHeader, IPropsTabs, IPropsTodos, IPropsSettingsModal } from './types'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.on()

		return () => x.off()
	}, [])

	const props_dir_tree: IPropsDirTree = {
		module: 'todo',
		actions: {
			onClick: useMemoizedFn((v) => (x.services.id = v)),
			getRefs,
			add,
			remove,
			update
		}
	}

	const props_header: IPropsHeader = {
		name: x.services.info.name,
		desc: x.services.info.desc,
		showSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = true))
	}

	const props_tabs: IPropsTabs = {
		angles: toJS(x.services.info.angles),
		angle: x.services.angle,
		setCurrentAngle: useMemoizedFn((v: string) => (x.services.angle = v))
	}

	const props_todos: IPropsTodos = {
		items: toJS(x.services.items)
	}

	const props_settings_modal: IPropsSettingsModal = {
		visible_settings_modal: x.visible_settings_modal,
		info: toJS(x.services.info),
		closeSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = false))
	}

	return (
		<div className={$cx(styles._local, 'w_100 h_100vh flex flex_column')}>
			<DirTree {...props_dir_tree}></DirTree>
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
