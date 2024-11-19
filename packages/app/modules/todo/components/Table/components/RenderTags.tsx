import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useGlobal } from '@/context/app'
import { getTagColor } from '@/utils'

import TagSelect from '../../TagSelect'
import styles from '../index.css'

import type { Todo, Tag } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['tag_ids'], { tags: Array<Tag> }>) => {
	const { value, extra, editing, onFocus, onChange } = props
	const { tags } = extra
	const { t } = useTranslation()
	const global = useGlobal()

	const items = useMemo(() => {
		if (!value) return

		return value.map(i => tags.find(tag => tag.id === i))
	}, [value, tags])

	return (
		<div className={$cx('flex justify_center', styles.RenderTags)} style={{ overflow: 'scroll' }}>
			{editing ? (
				<TagSelect
					useByTable
					options={tags}
					value={value!}
					onChange={onChange}
					onFocus={onFocus}
				></TagSelect>
			) : (
				<div className={$cx(styles.RenderTagsViewer, 'w_100 flex justify_center')}>
					<Choose>
						<When condition={items !== undefined && items?.length > 0}>
							{items?.map(item => {
								const tag_color = getTagColor(item!.color, global.setting.theme)

								return (
									<span
										className='tag_item'
										style={{
											backgroundColor: tag_color.bg_color,
											color: tag_color.text_color
										}}
										key={item!.id}
									>
										{item!.text}
									</span>
								)
							})}
						</When>
						<Otherwise>
							<span className='color_text_light'>{t('todo.Input.tag_placeholder')}</span>
						</Otherwise>
					</Choose>
				</div>
			)}
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
