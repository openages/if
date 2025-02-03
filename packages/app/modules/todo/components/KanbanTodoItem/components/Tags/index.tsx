import FlatTagSelect from '../../../FlatTagSelect'
import styles from './index.css'

import type { IPropsFlatTodoItem } from '@/modules/todo/types'

interface IProps {
	tags: IPropsFlatTodoItem['tags']
	tag_ids: IPropsFlatTodoItem['item']['tag_ids']
	useByKanban?: boolean
	updateTags: (v: Array<string>) => void
}

const Index = (props: IProps) => {
	const { tags, tag_ids, useByKanban, updateTags } = props

	return (
		<div className={$cx(styles._local)}>
			<FlatTagSelect
				className='tag_select'
				useByKanban={useByKanban}
				options={tags}
				value={tag_ids!}
				onChange={updateTags}
			></FlatTagSelect>
		</div>
	)
}

export default $app.memo(Index)
