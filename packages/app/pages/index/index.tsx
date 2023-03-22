import { useMemoizedFn } from 'ahooks'
import { Affix } from 'antd'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Else, If, Then } from 'react-if'
import { container } from 'tsyringe'

import { DataEmpty, DirTree } from '@/components'

import { Header, Input, Tabs, Todos } from './components'
import styles from './index.css'
import Model from './model'

import type { IPropsDirTree } from '@/components'
import type { IPropsHeader, IPropsTabs, IPropsTodos } from './types'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))

	const onClick = useMemoizedFn((v) => {})

	const props_dir_tree: IPropsDirTree = {
		module: 'todo',
		onClick
	}

	const props_header: IPropsHeader = {
		name: x.todo_list.name,
		desc: x.todo_list.desc
	}

	const props_tabs: IPropsTabs = {
		angles: toJS(x.angles),
		current_angle: x.current_angle,
		setCurrentAngle: useMemoizedFn((v: string) => (x.current_angle = v))
	}

	const props_todos: IPropsTodos = {
		todo_items: toJS(x.todo_items)
	}

	return (
		<div className={$cx(styles._local, 'w_100 h_100vh flex justify_center align_center')}>
			<DirTree {...props_dir_tree}></DirTree>
			<If condition={x.todo_list?.name}>
				<Then>
					<Header {...props_header}></Header>
					<Tabs {...props_tabs}></Tabs>
					<Todos {...props_todos}></Todos>
					<Affix offsetBottom={0}>
						<Input></Input>
					</Affix>
				</Then>
				<Else>
					<DataEmpty></DataEmpty>
				</Else>
			</If>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
