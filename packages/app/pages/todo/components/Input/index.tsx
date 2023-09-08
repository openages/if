import { Input, Select } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'

import { useLimits } from '@/hooks'

import styles from './index.css'
import Tag from './Tag'

import type { IPropsInput } from '../../types'

const { TextArea } = Input

const Index = (props: IPropsInput) => {
	const { tags } = props
	const limits = useLimits()
	const { t } = useTranslation()

	const tag_options = useMemo(() => {
		if (!tags) return []

		return tags.map((item) => ({
			label: item.text,
			value: JSON.stringify(item)
		}))
	}, [tags])

	return (
		<div className={$cx('w_100 fixed bottom_0 z_index_1000', styles._local)}>
			<div className='limited_content_wrap flex flex_column'>
				<div className='options_wrap flex align_center'>
					<When condition={Boolean(tags)}>
						<Select
							className='select_tag'
							size='small'
							suffixIcon={null}
							mode='multiple'
							placement='topLeft'
							placeholder={t('translation:todo.Input.tag_placeholder')}
							tagRender={Tag}
                                          options={ tag_options }
						></Select>
					</When>
				</div>
				<TextArea
					className='input_add_todo w_100 border_box'
					placeholder={t('translation:todo.Input.placeholder')}
					maxLength={limits.todo_text_max_length}
					autoSize
				></TextArea>
			</div>
		</div>
	)
}

export default $app.memo(Index)
