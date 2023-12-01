import { useMemoizedFn } from 'ahooks'
import { Input, Select } from 'antd'
import { cloneDeep } from 'lodash-es'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'

import { todo } from '@/appdata'
import { id } from '@/utils'

import { getGroup, getTodo } from '../../initials'
import Cycle from '../Cycle'
import Remind from '../Remind'
import Star from '../Star'
import TagSelect from '../TagSelect'
import styles from './index.css'

import type { Todo } from '@/types'
import type { IPropsCircle, IPropsInput, IPropsRemind } from '../../types'

const { TextArea } = Input

const Index = (props: IPropsInput) => {
	const { loading, tags, create } = props
	const { t } = useTranslation()
	const [input, setInput] = useState<Omit<Todo.TodoItem, 'file_id' | 'angle_id' | 'sort'>>(getTodo())

	useEffect(() => {
		if (input.type === 'todo') {
			setInput(getTodo())
		} else {
			setInput(getGroup())
		}
	}, [input.type])

	useEffect(() => {
		if (loading) return

		setInput(v => ({
			...v,
			id: id(),
			text: '',
			remind_time: undefined,
			cycle_enabled: false,
			cycle: undefined
		}))
	}, [loading])

	const props_remind: IPropsRemind = {
		remind_time: (input as Todo.Todo).remind_time,
		onChangeRemind: useMemoizedFn(v => setInput(input => ({ ...input, remind_time: v })))
	}

	const props_circle: IPropsCircle = {
		cycle_enabled: (input as Todo.Todo).cycle_enabled,
		cycle: (input as Todo.Todo).cycle,
		onChangeCircle: useMemoizedFn(v => setInput(input => ({ ...input, ...v })))
	}

	const onEnter = useMemoizedFn(e => {
		e.preventDefault()

		if (loading) return

		create({ ...input, create_at: new Date().valueOf() } as Todo.TodoItem)
	})

	return (
		<div className={$cx('w_100 fixed bottom_0 z_index_1000', styles._local)}>
			<div className='limited_content_wrap flex flex_column'>
				<div className='options_wrap flex justify_between align_center'>
					<div className='flex align_center'>
						<Select
							className='select_type select'
							size='small'
							placement='topLeft'
							bordered={false}
							virtual={false}
							suffixIcon={null}
							options={[
								{ label: t('translation:todo.Input.type.todo'), value: 'todo' },
								{ label: t('translation:todo.Input.type.group'), value: 'group' }
							]}
							value={input.type}
							onChange={v => {
								const target = cloneDeep(input)

								target.type = v

								setInput(target)
							}}
						></Select>
						<When condition={Boolean(tags) && tags?.length && input.type === 'todo'}>
							<TagSelect
								options={tags}
								value={(input as Todo.Todo).tag_ids}
								onChange={v => {
									if (v?.length > 3) return

									setInput(input => ({ ...input, tag_ids: v }))
								}}
							></TagSelect>
						</When>
					</div>
					<When condition={input.type === 'todo'}>
						<div className='flex align_center'>
							<div className='star_wrap flex align_center mr_8 relative'>
								<Star
									value={(input as Todo.Todo).star}
									onChangeStar={v => setInput(input => ({ ...input, star: v }))}
								></Star>
							</div>
							<div className='divide_line'></div>
							<Remind {...props_remind}></Remind>
							<div className='divide_line'></div>
							<Cycle {...props_circle}></Cycle>
						</div>
					</When>
				</div>
				<TextArea
					className='input_add_todo w_100 border_box'
					placeholder={t('translation:todo.Input.placeholder')}
					autoSize
					maxLength={todo.text_max_length}
					value={input.text}
					onChange={({ target: { value } }) => setInput(input => ({ ...input, text: value }))}
					onPressEnter={onEnter}
				></TextArea>
			</div>
		</div>
	)
}

export default $app.memo(Index)
