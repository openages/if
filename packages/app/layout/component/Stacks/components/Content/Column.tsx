import { useDndMonitor } from '@dnd-kit/core'
import { Fragment, useState } from 'react'
import Drop from './Drop'
import View from './View'
import styles from './index.css'

import type { IPropsStacksContentColumn } from '../../../../types'

const Index = (props: IPropsStacksContentColumn) => {
	const { column_index, column, width, click } = props
	const [visible_indicator, setVisibleIndicator] = useState(false)

	useDndMonitor({
		onDragStart: ({ active }) => active.data.current.type === 'stack' && setVisibleIndicator(true),
		onDragEnd: ({ active }) => active.data.current.type === 'stack' && setVisibleIndicator(false)
	})

	return (
		<div className={$cx('border_box relative', styles.Column)} style={{ width: `${column.width}%` }}>
			{visible_indicator && (
				<Fragment>
					<Drop column_index={column_index} direction='left'></Drop>
					<Drop column_index={column_index} direction='right'></Drop>
				</Fragment>
			)}
			{column.views.map((view, view_index) => (
				<View
					column_index={column_index}
					view_index={view_index}
					view={view}
					width={width}
					click={click}
					key={view.id}
				></View>
			))}
		</div>
	)
}

export default $app.memo(Index)
