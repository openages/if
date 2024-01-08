import TagSelect from '../../TagSelect'
import styles from '../index.css'

import type { CustomFormItem, Todo } from '@/types'

interface IProps extends CustomFormItem<Todo.Todo['tag_ids']> {
	options: Todo.Setting['tags']
}

const Index = (props: IProps) => {
	const { options, value, onChange } = props

	return (
		<div className={$cx('flex justify_center', styles.RenderTags)} style={{ overflow: 'scroll' }}>
			<TagSelect useByTable options={options} value={value} onChange={onChange}></TagSelect>
		</div>
	)
}

export default $app.memo(Index)
