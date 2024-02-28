import TagSelect from '../../TagSelect'
import styles from '../index.css'

import type { Todo } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['tag_ids']>) => {
	const { value, extra, onChange } = props
	const { tags } = extra

	return (
		<div className={$cx('flex justify_center', styles.RenderTags)} style={{ overflow: 'scroll' }}>
			<TagSelect useByTable options={tags} value={value} onChange={onChange}></TagSelect>
		</div>
	)
}

export default $app.memo(Index)
