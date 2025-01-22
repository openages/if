import CycleStatus from '../../../CycleStatus'
import styles from './index.css'

import type { IPropsFlatTodoItem } from '@/modules/todo/types'

interface IProps {
	cycle: IPropsFlatTodoItem['item']['cycle']
	recycle_time: IPropsFlatTodoItem['item']['recycle_time']
}

const Index = (props: IProps) => {
	const { cycle, recycle_time } = props

	return (
		<div className={$cx('option_item flex align_center', styles._local)}>
			<CycleStatus useByFlat cycle={cycle} recycle_time={recycle_time}></CycleStatus>
		</div>
	)
}

export default $app.memo(Index)
