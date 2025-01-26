import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import TagSelect from '../../TagSelect'
import styles from '../index.css'

import type { Todo, Tag } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['tag_ids'], { tags: Array<Tag> }>) => {
	const { value, extra, editing, onFocus, onChange } = props
	const { tags } = extra
	const { t } = useTranslation()

	const items = useMemo(() => {
		if (!value) return

		return value.map(i => tags.find(tag => tag.id === i))
	}, [value, tags])

	return (
		<div className={$cx('flex justify_center flex_wrap', styles.RenderTags)}>
			{editing ? (
				<TagSelect
					useByTable
					options={tags}
					value={value!}
					onChange={onChange}
					onFocus={onFocus}
				></TagSelect>
			) : (
				<div className={$cx(styles.RenderTagsViewer, 'w_100 flex justify_center align_center')}>
					<Choose>
						<When condition={items !== undefined && items?.length > 0}>
							{items?.map(item => {
								return (
									<div className='tag flex align_center'>
										<span
											className='color'
											style={{ backgroundColor: item!.color }}
										></span>
										<span className='text'>{item!.text}</span>
									</div>
								)
							})}
						</When>
						<Otherwise>
							<span className='color_text_light' style={{ marginLeft: 1 }}>
								{t('todo.Input.tag_placeholder')}
							</span>
						</Otherwise>
					</Choose>
				</div>
			)}
		</div>
	)
}

export default $app.memo(Index)
