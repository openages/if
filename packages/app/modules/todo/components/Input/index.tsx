import { useMemoizedFn } from 'ahooks'
import { Select, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'

import { useInput } from '@/modules/todo/hooks'
import { id } from '@/utils'
import { Calendar, Sun } from '@phosphor-icons/react'

import { getGroup, getTodo } from '../../initials'
import Cycle from '../Cycle'
import DateTime from '../DateTime'
import Level from '../Level'
import TagSelect from '../TagSelect'
import styles from './index.css'

import type { Todo } from '@/types'
import type { KeyboardEvent } from 'react'
import type { IPropsCircle, IPropsInput, IPropsDateTime } from '../../types'

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

		setInput({ ...input, id: id(), text: '' } as Todo.Todo)
	}, [loading])

	const props_remind: IPropsDateTime = {
		value: (input as Todo.Todo).remind_time,
		onChange: useMemoizedFn(v => setInput(input => ({ ...input, remind_time: v })))
	}

	const props_deadline: IPropsDateTime = {
		value: (input as Todo.Todo).end_time,
		Icon: Calendar,
		onChange: useMemoizedFn(v => setInput(input => ({ ...input, end_time: v })))
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
								<Level
									value={(input as Todo.Todo).level}
									onChangeLevel={v => setInput(input => ({ ...input, level: v }))}
								></Level>
							</div>
							<Tooltip
								title={t('translation:modules.schedule')}
								destroyTooltipOnHide
								placement='bottom'
							>
								<div
									className={$cx(
										'schedule_wrap flex justify_center align_center clickable',
										(input as Todo.Todo).schedule && 'active'
									)}
									onClick={() =>
										setInput(input => ({
											...input,
											schedule: !(input as Todo.Todo).schedule
										}))
									}
								>
									<Sun size={15}></Sun>
								</div>
							</Tooltip>
							<Tooltip
								title={t('translation:todo.Input.Remind.title')}
								destroyTooltipOnHide
								placement='bottom'
							>
								<div>
									<DateTime {...props_remind}></DateTime>
								</div>
							</Tooltip>
							<Tooltip
								title={t('translation:todo.Input.Deadline.title')}
								destroyTooltipOnHide
								placement='bottom'
							>
								<div>
									<DateTime {...props_deadline}></DateTime>
								</div>
							</Tooltip>
							<Tooltip
								title={t('translation:todo.Input.Cycle.title')}
								destroyTooltipOnHide
								placement='bottom'
							>
								<div>
									<Cycle {...props_circle}></Cycle>
								</div>
							</Tooltip>
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
