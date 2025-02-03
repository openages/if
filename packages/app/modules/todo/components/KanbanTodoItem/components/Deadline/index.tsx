import DeadlineStatus from '../../../DeadlineStatus'
import styles from './index.css'

import type { IPropsFlatTodoItem } from '@/modules/todo/types'

interface IProps {
	end_time: IPropsFlatTodoItem['item']['end_time']
}

const Index = (props: IProps) => {
	const { end_time } = props

	return (
		<div className={$cx('option_item flex align_center', styles._local)}>
			<DeadlineStatus useByFlat end_time={end_time}></DeadlineStatus>
		</div>
	)
}

export default $app.memo(Index)
