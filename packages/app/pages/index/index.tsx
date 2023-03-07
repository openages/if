import { useMemoizedFn } from 'ahooks'
import { Affix } from 'antd'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { container } from 'tsyringe'

import { DirTree } from '@/components'

import { Header, Input, Tabs, Todos } from './components'
import styles from './index.css'
import Model from './model'

import type { IPropsDirTree } from '@/components'
import type { IPropsHeader, IPropsTabs, IPropsTodos } from './types'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))

	const onClick = useMemoizedFn((v) => (x.active_item = v))

	const props_dir_tree: IPropsDirTree = {
		items: [
			{
				id: 'now',
				title: 'Now',
				type: 'file',
				counts: 6
			},
			{
				id: 'life',
				title: 'Life',
				type: 'file',
				counts: 30
			},
			{
				id: 'plan',
				title: 'Plan',
				type: 'file',
				counts: 893
			},
			{
				id: 'epc',
				title: 'EPC',
				type: 'dir',
				children: [
					{
						id: 'plan',
						title: 'Plan',
						type: 'file',
						counts: 10
					},
					{
						id: 'now',
						title: 'Now',
						type: 'file',
						counts: 3
					},
					{
						id: 'trash',
						title: 'Plan',
						type: 'file',
						counts: 0
					},
					{
						id: 'callback',
						title: 'callback',
						type: 'file',
						counts: 99
					}
				]
			},
			{
				id: 'lanto',
				title: 'Lanto',
				type: 'dir',
				children: [
					{
						id: 'plan',
						title: 'Plan',
						type: 'file',
						counts: 10
					},
					{
						id: 'now',
						title: 'Now',
						type: 'file',
						counts: 3
					},
					{
						id: 'trash',
						title: 'Plan',
						type: 'file',
						counts: 0
					},
					{
						id: 'callback',
						title: 'callback',
						type: 'file',
						counts: 99
					}
				]
			},
			{
				id: 'if',
				title: 'if',
				type: 'file',
				counts: 77
			}
		],
		activeItem: toJS(x.active_item),
		onClick
	}

	const props_header: IPropsHeader = {
		info: toJS(x.info)
	}

	const props_tabs: IPropsTabs = {
		tabs: toJS(x.tabs),
		active_tab_index: x.active_tab_index,
		setActiveTabIndex: useMemoizedFn(x.setActiveTabIndex)
	}

	const props_todos: IPropsTodos = {
		todo_items: toJS(x.todo_items)
	}

	return (
		<div className={$cx(styles._local)}>
			<DirTree {...props_dir_tree}></DirTree>
			<Header {...props_header}></Header>
			<Tabs {...props_tabs}></Tabs>
			<Todos {...props_todos}></Todos>
			<Affix offsetBottom={0}>
				<Input></Input>
			</Affix>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
