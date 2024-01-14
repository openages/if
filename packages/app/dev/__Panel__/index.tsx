import { Button, Tabs } from 'antd'
import { useState, Fragment } from 'react'

import { Modal } from '@/components'
import { Code } from '@phosphor-icons/react'

import { Common_createFile } from '../Common'
import { Todo_insertItems } from '../Todo'
import styles from './index.css'

import type { TabsProps } from 'antd'

const Index = () => {
	const [open, setOpen] = useState(false)

	const Todo = (
		<div className='flex flex_wrap'>
			<div className='btn_wrap w_100 border_box'>
				<Button
					className='btn clickable'
					size='small'
					onClick={() => Common_createFile('todo', 'file')}
				>
					创建文件
				</Button>
			</div>
			<div className='btn_wrap w_100 border_box'>
				<Button className='btn clickable' size='small' onClick={() => Common_createFile('todo', 'dir')}>
					创建文件夹
				</Button>
			</div>
			<div className='btn_wrap w_100 border_box'>
				<Button className='btn clickable' size='small' onClick={Todo_insertItems}>
					插入任务
				</Button>
			</div>
		</div>
	)

	const items: TabsProps['items'] = [
		{
			label: 'Todo',
			key: 'Todo',
			children: Todo
		}
	]

	return (
		<Fragment>
			<div
				className={$cx(
					'border_box flex justify_center align_center fixed bottom_0 right_0 z_index_1000 clickable',
					styles.trigger
				)}
				onClick={() => setOpen(true)}
			>
				<Code size={15}></Code>
			</div>
			<Modal
				title='Dev Tool'
				className={styles._local}
				maskClosable
				width={240}
				open={open}
				getContainer={() => document.body}
				onCancel={() => setOpen(false)}
			>
				<Tabs tabPosition='left' items={items}></Tabs>
			</Modal>
		</Fragment>
	)
}

export default $app.memo(Index)
