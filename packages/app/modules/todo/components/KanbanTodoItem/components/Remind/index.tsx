import RemindStatus from '../../../RemindStatus'
import styles from './index.css'

import type { IPropsFlatTodoItem } from '@/modules/todo/types'

interface IProps {
	remind_time: IPropsFlatTodoItem['item']['remind_time']
}

const Index = (props: IProps) => {
	const { remind_time } = props

	return (
		<div className={$cx('option_item flex align_center', styles._local)}>
			<RemindStatus useByFlat remind_time={remind_time}></RemindStatus>
		</div>
	)
}

export default $app.memo(Index)
