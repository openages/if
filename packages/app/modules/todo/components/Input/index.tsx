import { useMemoizedFn } from 'ahooks'
import { Select } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'

import { useInput } from '@/modules/todo/hooks'
import { id } from '@/utils'

import { getGroup, getTodo } from '../../initials'
import Cycle from '../Cycle'
import Remind from '../Remind'
import Star from '../Star'
import TagSelect from '../TagSelect'
import styles from './index.css'

import type { Todo } from '@/types'
import type { KeyboardEvent } from 'react'
import type { IPropsCircle, IPropsInput, IPropsRemind } from '../../types'

const Index = (props: IPropsInput) => {
	const { loading, tags, create } = props
	const { t } = useTranslation()
	const [input, setInput] = useState<Omit<Todo.TodoItem, 'file_id' | 'angle_id' | 'sort'>>(getTodo())
	const {
		input: input_ref,
		onInput,
		updateValue
	} = useInput({
		value: input.text,
		update: useMemoizedFn(v => setInput(input => ({ ...input, text: v })))
	})

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

	const onKeyDown = useMemoizedFn(async (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key !== 'Enter') return
		if (loading) return

		e.preventDefault()

		const textContent = await updateValue(input_ref.current.textContent)

		create({ ...input, text: textContent, create_at: new Date().valueOf() } as Todo.TodoItem)
	})

	return (
		<div className={$cx('w_100 border_box sticky bottom_0 z_index_10 flex align_end', styles._local)}>
			<div className='limited_content_wrap flex flex_column'>
				<div className='options_wrap flex flex_wrap justify_between align_center'>
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
								const target = $copy(input)

								target.type = v

								setInput(target)
							}}
						></Select>
						<When condition={Boolean(tags) && tags?.length && input.type === 'todo'}>
							<TagSelect
								options={tags}
								value={(input as Todo.Todo).tag_ids}
								onChange={v => {
									setInput(input => ({ ...input, tag_ids: v }))
								}}
							></TagSelect>
						</When>
					</div>
					<When condition={input.type === 'todo'}>
						<div className='flex align_center'>
							<div className='star_wrap flex align_center mr_6 relative'>
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
				<div
					className='input_add_todo w_100 border_box transition_normal'
					contentEditable='plaintext-only'
					data-placeholder={t('translation:todo.Input.placeholder')}
					ref={input_ref}
					onInput={onInput}
					onKeyDown={onKeyDown}
				></div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
