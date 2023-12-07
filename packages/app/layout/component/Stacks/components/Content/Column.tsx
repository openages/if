import { useDndMonitor } from '@dnd-kit/core'
import { Fragment, useState } from 'react'
import Drop from './Drop'
import View from './View'
import styles from './index.css'

import type { IPropsStacksContentColumn } from '../../../../types'

const Index = (props: IPropsStacksContentColumn) => {
	const { column, column_index } = props
	const [visible_indicator, setVisibleIndicator] = useState(false)

	useDndMonitor({
		onDragStart: ({ active }) => active.data.current.type === 'stack' && setVisibleIndicator(true),
		onDragEnd: ({ active }) => active.data.current.type === 'stack' && setVisibleIndicator(false)
	})

	return (
		<div className={$cx('relative', styles.Column)} style={{ width: column.width }}>
			{visible_indicator && (
				<Fragment>
					<Drop column_index={column_index} direction='left'></Drop>
					<Drop column_index={column_index} direction='right'></Drop>
				</Fragment>
			)}
			{column.views.map(view => (
				<View view={view} key={view.id}></View>
			))}
		</div>
	)
}

export default $app.memo(Index)
