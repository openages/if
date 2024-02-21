import { useEventListener, useMemoizedFn } from 'ahooks'
import { Form, Input, Select } from 'antd'
import { debounce } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { useRef, useState } from 'react'
import { container } from 'tsyringe'

import { useDeepEffect } from '@/hooks'
import { deepEqual } from '@openages/stk/react'
import { ListChecks, ListPlus } from '@phosphor-icons/react'

import styles from './index.css'
import Model from './model'

import type { IPropsCalendarViewTimeBlockDetail } from '../../types'

const { useForm, Item } = Form
const { TextArea } = Input

const Index = (props: IPropsCalendarViewTimeBlockDetail) => {
	const { item, updateTimeBlock } = props
	const [x] = useState(() => container.resolve(Model))
	const [form] = useForm()
	const searcher = useRef<HTMLInputElement>()
	const { setFieldsValue, getFieldsValue } = form
	const search_todos = $copy(x.search_todos)

	useDeepEffect(() => {
		const form_item = getFieldsValue()

		if (deepEqual(item, form_item)) return

		const target = $copy(item)

		if (!item.tag) target.tag = null

		setFieldsValue(target)

		if (!item.todos.length) x.tab = 'set_todos'
	}, [item])

	useEventListener('compositionstart', () => (x.compositing = true), { target: searcher?.current })

	useEventListener(
		'compositionend',
		() => {
			x.compositing = false

			x.search(searcher.current.value)
		},
		{ target: searcher?.current }
	)

	const onInputKeyDown = useMemoizedFn(e => {
		if (searcher.current) return

		searcher.current = e.target as HTMLInputElement
	})

	const search = useMemoizedFn(debounce(x.search, 300))

	const setTabTodos = useMemoizedFn(() => (x.tab = 'todos'))
	const setTabSetTodos = useMemoizedFn(() => (x.tab = 'set_todos'))

	return (
		<Form className={$cx('border_box relative', styles._local)} form={form}>
			<Item label='描述' name='text'>
				<TextArea autoSize placeholder='输入描述'></TextArea>
			</Item>
			<Item label='标签' name='tag'>
				<Select
					className='select'
					variant='borderless'
					suffixIcon={null}
					placeholder='选择标签'
				></Select>
			</Item>
			{x.tab === 'set_todos' && (
				<Item name='todos' noStyle dependencies={[search_todos]}>
					<Select
						className='select todos w_100'
						popupClassName='small'
						variant='borderless'
						suffixIcon={null}
						placeholder='搜索待办'
						fieldNames={{ label: 'text', value: 'id' }}
						filterOption={false}
						mode='multiple'
						showSearch
						options={search_todos}
						onInputKeyDown={onInputKeyDown}
						onSearch={search}
					></Select>
				</Item>
			)}
			<div className='tab_wrap w_100 border_box flex absolute bottom_0 left_0'>
				<span
					className={$cx(
						'tab_item h_100 border_box flex justify_center align_center clickable',
						x.tab === 'todos' && 'active'
					)}
					onClick={setTabTodos}
				>
					<ListChecks size={14}></ListChecks>
				</span>
				<span
					className={$cx(
						'tab_item h_100 border_box flex justify_center align_center clickable',
						x.tab === 'set_todos' && 'active'
					)}
					onClick={setTabSetTodos}
				>
					<ListPlus size={14}></ListPlus>
				</span>
			</div>
		</Form>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
