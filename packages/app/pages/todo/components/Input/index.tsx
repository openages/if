import { useMemoizedFn, useReactive } from 'ahooks'
import { Input, Select } from 'antd'
import { cloneDeep } from 'lodash-es'
import { useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'

import { useLimits } from '@/hooks'
import { id } from '@/utils'

import Circle from './Circle'
import styles from './index.css'
import getTag from './Tag'

import type { IPropsInput, IPropsInputCircle } from '../../types'
import type { Todo } from '@/types'

const { TextArea } = Input

const Index = (props: IPropsInput) => {
	const { current_angle_id, loading, tags, add } = props
	const limits = useLimits()
	const { t } = useTranslation()
	const r = useReactive<Todo.TodoItem>({
		id: id(),
		type: 'todo',
		status: 'unchecked',
		text: '',
		angle_id: current_angle_id,
		create_at: new Date().valueOf()
	})

	useEffect(() => {
		;(r as Todo.Todo).tag_ids = []
	}, [r.type])

	useEffect(() => {
		if (loading) return

		r.id = id()
		r.text = ''
	}, [loading])

	const tag_options = useMemo(() => {
		if (!tags || !tags?.length) return []

		return tags.map((item) => ({
			label: item.text,
			value: item.id
		}))
	}, [tags])

	const Tag = useMemo(() => {
		if (!tags || !tags?.length) return null

		return getTag(tags)
	}, [tags])

	const props_circle: IPropsInputCircle = {
		circle: cloneDeep((r as Todo.Todo).circle),
		onChangeCircle: useMemoizedFn((v) => ((r as Todo.Todo).circle = v))
	}

	const onEnter = useMemoizedFn((e) => {
		e.preventDefault()

		add(cloneDeep(r))
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
								{ label: t('translation:todo.Input.type.title'), value: 'title' }
							]}
							value={r.type}
							onChange={(v) => (r.type = v)}
						></Select>
						<When condition={Boolean(tags) && tags?.length && r.type === 'todo'}>
							<Select
								className='select_tag select'
								size='small'
								mode='multiple'
								placement='topLeft'
								bordered={false}
								virtual={false}
								maxTagCount={3}
								suffixIcon={null}
								placeholder={t('translation:todo.Input.tag_placeholder')}
								tagRender={Tag}
								options={tag_options}
								value={(r as Todo.Todo).tag_ids}
								onChange={(v) => ((r as Todo.Todo).tag_ids = v)}
							></Select>
						</When>
					</div>
					<When condition={r.type === 'todo'}>
						<Circle {...props_circle}></Circle>
					</When>
				</div>
				<TextArea
					className='input_add_todo w_100 border_box'
					placeholder={t('translation:todo.Input.placeholder')}
					maxLength={limits.todo_text_max_length}
					autoSize
					value={r.text}
					onChange={({ target: { value } }) => (r.text = value)}
					onPressEnter={onEnter}
				></TextArea>
			</div>
		</div>
	)
}

export default $app.memo(Index)
