import { useMemoizedFn } from 'ahooks'
import { Select, Tooltip } from 'antd'
import { $createParagraphNode, $getRoot, FORMAT_ELEMENT_COMMAND } from 'lexical'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { todo } from '@/appdata'
import { useText, Text } from '@/Editor'
import { id } from '@/utils'
import { Calendar, Sun } from '@phosphor-icons/react'

import { getGroup, getTodo } from '../../initials'
import Cycle from '../Cycle'
import DateTime from '../DateTime'
import Level from '../Level'
import TagSelect from '../TagSelect'
import styles from './index.css'

import type { Todo } from '@/types'
import type { IPropsCircle, IPropsInput, IPropsDateTime } from '../../types'
import type { ParagraphNode } from 'lexical'

const Index = (props: IPropsInput) => {
	const { loading, tags, create } = props
	const { t } = useTranslation()
	const [input, setInput] = useState<Omit<Todo.TodoItem, 'file_id' | 'angle_id' | 'sort'>>(getTodo())

	const { ref_editor, onChange, setEditor, setRef } = useText({
		text: input.text,
		update: v => setInput(input => ({ ...input, text: v }))
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
		value: (input as Todo.Todo).remind_time!,
		onChange: useMemoizedFn(v => setInput(input => ({ ...input, remind_time: v })))
	}

	const props_deadline: IPropsDateTime = {
		value: (input as Todo.Todo).end_time!,
		Icon: Calendar,
		onChange: useMemoizedFn(v => setInput(input => ({ ...input, end_time: v })))
	}

	const props_circle: IPropsCircle = {
		cycle_enabled: (input as Todo.Todo).cycle_enabled,
		cycle: (input as Todo.Todo).cycle,
		onChange: useMemoizedFn(v => setInput(input => ({ ...input, cycle: v }))),
		onChangeItem: useMemoizedFn(v => setInput(input => ({ ...input, ...v })))
	}

	const onKeyDown = useMemoizedFn(async (e: KeyboardEvent) => {
		if (e.key !== 'Enter') return
		if (loading) return
		if (!ref_editor.current) return

		e.preventDefault()

		let text: string

		if (input.type === 'todo') {
			text = JSON.stringify(ref_editor.current.getEditorState().toJSON())
		} else {
			text = ref_editor.current.getEditorState().read(() => $getRoot().getTextContent())
		}

		create({ ...input, text, create_at: new Date().valueOf() } as Todo.TodoItem, { top: true })

		ref_editor.current.update(() => {
			const root = $getRoot()
			const node = root.getFirstChild() as ParagraphNode

			node.clear()
		})
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
							variant='borderless'
							virtual={false}
							suffixIcon={null}
							options={[
								{ label: t('todo.Input.type.todo'), value: 'todo' },
								{ label: t('todo.Input.type.group'), value: 'group' }
							]}
							value={input.type}
							onChange={v => {
								const target = $copy(input)

								target.type = v

								setInput(target)
							}}
						></Select>
						<If condition={Boolean(tags) && !!tags?.length && input.type === 'todo'}>
							<TagSelect
								options={tags!}
								value={(input as Todo.Todo).tag_ids!}
								onChange={v => {
									setInput(input => ({ ...input, tag_ids: v }))
								}}
							></TagSelect>
						</If>
					</div>
					<If condition={input.type === 'todo'}>
						<div className='flex align_center'>
							<div className='level_wrap flex align_center mr_6 relative'>
								<Level
									value={(input as Todo.Todo).level}
									onChangeLevel={v => setInput(input => ({ ...input, level: v }))}
								></Level>
							</div>
							<Tooltip
								title={t('modules.schedule')}
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
								title={t('todo.Input.Remind.title')}
								destroyTooltipOnHide
								placement='bottom'
							>
								<div className='cursor_point'>
									<DateTime {...props_remind}></DateTime>
								</div>
							</Tooltip>
							<Tooltip
								title={t('todo.Input.Deadline.title')}
								destroyTooltipOnHide
								placement='bottom'
							>
								<div className='cursor_point'>
									<DateTime {...props_deadline}></DateTime>
								</div>
							</Tooltip>
							<Tooltip
								title={t('todo.Input.Cycle.title')}
								destroyTooltipOnHide
								placement='bottom'
							>
								<div>
									<Cycle {...props_circle}></Cycle>
								</div>
							</Tooltip>
						</div>
					</If>
				</div>
				<Text
					className='input_add_todo w_100 border_box transition_normal'
					placeholder_classname='input_add_todo_placeholder'
					placeholder={t('todo.Input.placeholder')}
					max_length={todo.text_max_length}
					show_on_top
					onChange={onChange}
					setEditor={setEditor}
					onKeyDown={onKeyDown}
					setRef={setRef}
				></Text>
			</div>
		</div>
	)
}

export default $app.memo(Index)
