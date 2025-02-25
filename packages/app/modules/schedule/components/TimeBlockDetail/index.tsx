import { useEventListener, useMemoizedFn } from 'ahooks'
import { Form, InputNumber, Select } from 'antd'
import dayjs from 'dayjs'
import { debounce, pick } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { container } from 'tsyringe'

import { schedule } from '@/appdata'
import { Todos } from '@/atoms'
import { TextEditor } from '@/Editor/components'
import { useCreateEffect } from '@/hooks'
import { deepEqual, useDeepMemo } from '@openages/stk/react'
import { ListChecks, MagnifyingGlass, Minus, Plus } from '@phosphor-icons/react'

import { getTimeText, getTimeTextValue } from '../../utils'
import styles from './index.css'
import Model from './model'

import type { IPropsTimeBlockDetail } from '../../types'

const { useForm, Item } = Form

const Index = (props: IPropsTimeBlockDetail) => {
	const { item, tags, updateTimeBlock } = props
	const [x] = useState(() => container.resolve(Model))
	const [form] = useForm()
	const searcher = useRef<HTMLInputElement>()
	const { t } = useTranslation()
	const { setFieldsValue, getFieldsValue } = form
	const { start_time, end_time } = item
	const search_todos = $copy(x.search_todos)

	const options_todos = useDeepMemo(
		() => search_todos.filter(it => !item.todos.includes(it.id)),
		[search_todos, item.todos]
	)

	const { time, cross_time } = useMemo(() => {
		const start = dayjs(start_time)
		const end = dayjs(end_time)
		const { value, text } = getTimeText(start, end)

		return {
			time: value,
			cross_time: text
		}
	}, [start_time, end_time])

	useCreateEffect(() => {
		const form_item = getFieldsValue()
		const target = $copy(pick(item, ['text', 'tag', 'remark']))

		if (!target.tag) target.tag = undefined as unknown as string
		if (deepEqual(target, form_item)) return

		setFieldsValue({ ...target, time })

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
	})

	const onChangeTodos = useMemoizedFn((todos: Array<string>) => updateTimeBlock(item.id, { todos }))

	const onValuesChange = useMemoizedFn(v => {
		if ('time' in v) {
			const start = dayjs(start_time)
			const end = start.add(v.time, 'minutes')
			const end_time = end.valueOf()
			const limit_time = start.endOf('day').valueOf() + 1

			if (end_time > limit_time) return

			updateTimeBlock(item.id, { end_time })
		} else {
			updateTimeBlock(item.id, v)
		}
	})

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
			<Item label={t('schedule.TimeBlockDetail.desc')} name='text'>
				<TextEditor
					className='text_wrap border_box'
					placeholder_classname='timeblock_placeholder'
					placeholder={t('schedule.timeblock_placeholder')}
					max_length={schedule.text_max_length}
				></TextEditor>
			</Item>
			<Item label={t('common.tags.single_label')} name='tag'>
				<Select
					className='select'
					variant='borderless'
					popupClassName='small'
					allowClear
					suffixIcon={null}
					placeholder={t('schedule.TimeBlockDetail.tag_placeholder')}
					fieldNames={{ label: 'text', value: 'id' }}
					options={tags}
					optionRender={({ data: { color, text } }: any) => (
						<div className='option_item w_100 flex align_center'>
							<span className='tag_color mr_6' style={{ backgroundColor: color }}></span>
							<span className='text'>{text}</span>
						</div>
					)}
				></Select>
			</Item>
			<Item label={t('schedule.TimeBlockDetail.time')} name='time'>
				<InputNumber
					className='w_100'
					step={5}
					min={20 as number}
					keyboard={false}
					formatter={_ => cross_time}
					parser={v => getTimeTextValue(v!)}
					controls={{ upIcon: <Plus></Plus>, downIcon: <Minus></Minus> }}
				></InputNumber>
			</Item>
			<Item label={t('schedule.TimeBlockDetail.remark')} name='remark' noStyle>
				<TextEditor
					className='text_wrap remark border_box'
					placeholder_classname='timeblock_placeholder'
					placeholder={t('schedule.remark_placeholder')}
					max_length={999}
					linebreak
				></TextEditor>
			</Item>
			{x.tab === 'search' ? (
				<Select
					className='select todos w_100'
					popupClassName='small'
					variant='borderless'
					allowClear
					suffixIcon={null}
					placeholder={
						t('dirtree.search_placeholder') + t('common.letter_space') + t('modules.todo')
					}
					fieldNames={{ label: 'text', value: 'id' }}
					filterOption={false}
					showSearch
					virtual
					options={options_todos}
					onInputKeyDown={onInputKeyDown}
					onSearch={search}
					onSelect={onSelectTodo}
				></Select>
			) : (
				<Todos show_placeholder mode='sortable' ids={item.todos} onChange={onChangeTodos}></Todos>
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
