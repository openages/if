import { useMemoizedFn } from 'ahooks'
import { Input, Select, Rate } from 'antd'
import { cloneDeep } from 'lodash-es'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'

import { useLimits } from '@/hooks'
import { id } from '@/utils'
import { Star } from '@phosphor-icons/react'

import TagSelect from '../TagSelect'
import Circle from './Circle'
import styles from './index.css'
import { getTodo, getGroup } from './initials'

import type { IPropsInput, IPropsInputCircle } from '../../types'
import type { Todo } from '@/types'

const { TextArea } = Input

const Index = (props: IPropsInput) => {
	const { loading, tags, create } = props
	const limits = useLimits()
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

		setInput((v) => ({
			...v,
			id: id(),
			text: '',
			circle_enabled: false,
			circle_value: undefined
		}))
	}, [loading])

	const props_circle: IPropsInputCircle = {
		circle_enabled: (input as Todo.Todo).circle_enabled,
		circle_value: (input as Todo.Todo).circle_value,
		onChangeCircle: useMemoizedFn((v) => setInput((input) => ({ ...input, ...v })))
	}

	const onEnter = useMemoizedFn((e) => {
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
							onChange={(v) => {
								const target = cloneDeep(input)

								target.type = v

								setInput(target)
							}}
						></Select>
						<When condition={Boolean(tags) && tags?.length && input.type === 'todo'}>
							<TagSelect
								options={tags}
								value={(input as Todo.Todo).tag_ids}
								onChange={(v) => {
									if (v?.length > 3) return

									setInput((input) => ({ ...input, tag_ids: v }))
								}}
							></TagSelect>
						</When>
					</div>
					<When condition={input.type === 'todo'}>
						<div className='flex align_center'>
							<div className='star_wrap flex align_center mr_8 relative'>
								<Rate
									count={6}
									character={({ index, value }) => (
										<Star
											size={18}
											weight={value >= index + 1 ? 'duotone' : 'regular'}
										/>
									)}
									value={(input as Todo.Todo).star}
									onChange={(v) => setInput((input) => ({ ...input, star: v }))}
								></Rate>
							</div>
							<Circle {...props_circle}></Circle>
						</div>
					</When>
				</div>
				<TextArea
					className='input_add_todo w_100 border_box'
					placeholder={t('translation:todo.Input.placeholder')}
					maxLength={limits.todo_text_max_length}
					autoSize
					value={input.text}
					onChange={({ target: { value } }) => setInput((input) => ({ ...input, text: value }))}
					onPressEnter={onEnter}
				></TextArea>
			</div>
		</div>
	)
}

export default $app.memo(Index)
