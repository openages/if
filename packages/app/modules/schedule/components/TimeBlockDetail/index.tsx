import { useEventListener, useMemoizedFn } from 'ahooks'
import { Form, Select } from 'antd'
import { debounce } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { useMemo, useRef, useState } from 'react'
import { container } from 'tsyringe'

import { Todos } from '@/atoms'
import { FormEditable } from '@/components'
import { useDeepEffect } from '@/hooks'
import { deepEqual, useDeepMemo } from '@openages/stk/react'
import { ListChecks, MagnifyingGlass } from '@phosphor-icons/react'

import styles from './index.css'
import Model from './model'

import type { IPropsCalendarViewTimeBlockDetail } from '../../types'

const { useForm, Item } = Form

const Index = (props: IPropsCalendarViewTimeBlockDetail) => {
	const { item, tags, updateTimeBlock, updateTodoSchedule } = props
	const [x] = useState(() => container.resolve(Model))
	const [form] = useForm()
	const searcher = useRef<HTMLInputElement>()
	const { setFieldsValue, getFieldsValue } = form
	const search_todos = $copy(x.search_todos)

	const options_todos = useDeepMemo(
		() => search_todos.filter(it => !item.todos.includes(it.id)),
		[search_todos, item.todos]
	)

	useDeepEffect(() => {
		const form_item = getFieldsValue()

		if (deepEqual(item, form_item)) return

		const target = $copy(item)

		if (!item.tag) target.tag = null

		setFieldsValue(target)

		if (!item.todos.length) x.tab = 'search'
	}, [item])

	useEventListener(
		'compositionstart',
		() => {
			if (!searcher?.current) return

			x.compositing = true
		},
		{ target: searcher?.current }
	)

	useEventListener(
		'compositionend',
		() => {
			if (!searcher?.current) return

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
	const setTabSearch = useMemoizedFn(() => (x.tab = 'search'))

	const onSelectTodo = useMemoizedFn(async v => {
		if (item.todos.includes(v)) return

		const todos = $copy(item.todos)

		todos.push(v)

		updateTimeBlock(item.id, { todos })
		updateTodoSchedule(v)
	})

	const onChangeTodos = useMemoizedFn((todos: Array<string>) => updateTimeBlock(item.id, { todos }))

	const onValuesChange = useMemoizedFn(v => updateTimeBlock(item.id, v))

	const stopPropagation = useMemoizedFn(e => {
		e.preventDefault()
		e.stopPropagation()
	})

	return (
		<Form
			className={$cx('border_box relative', styles._local)}
			form={form}
			onContextMenu={stopPropagation}
			onValuesChange={onValuesChange}
		>
			<Item label='描述' name='text'>
				<FormEditable className='text_wrap border_box' placeholder='输入描述'></FormEditable>
			</Item>
			<Item label='标签' name='tag'>
				<Select
					className='select'
					variant='borderless'
					popupClassName='small'
					allowClear
					suffixIcon={null}
					placeholder='选择标签'
					fieldNames={{ label: 'text', value: 'id' }}
					options={tags}
				></Select>
			</Item>
			{x.tab === 'search' ? (
				<Select
					className='select todos w_100'
					popupClassName='small'
					variant='borderless'
					suffixIcon={null}
					placeholder='搜索待办'
					fieldNames={{ label: 'text', value: 'id' }}
					filterOption={false}
					showSearch
					options={options_todos}
					onInputKeyDown={onInputKeyDown}
					onSearch={search}
					onSelect={onSelectTodo}
				></Select>
			) : (
				<Todos ids={item.todos} onChange={onChangeTodos}></Todos>
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
					{item.todos.length > 0 && <span className='ml_2 counts'>{item.todos.length}</span>}
				</span>
				<span
					className={$cx(
						'tab_item h_100 border_box flex justify_center align_center clickable',
						x.tab === 'search' && 'active'
					)}
					onClick={setTabSearch}
				>
					<MagnifyingGlass size={14}></MagnifyingGlass>
				</span>
			</div>
		</Form>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
