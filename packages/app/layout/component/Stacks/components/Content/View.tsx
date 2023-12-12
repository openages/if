import { unstable_Activity as Activity } from 'react'
import View from '../View'

import type { IPropsStacksContentView } from '../../../../types'

const Index = (props: IPropsStacksContentView) => {
	const { column_index, view_index, view, width, click } = props

	return (
		<Activity mode={view.active ? 'visible' : 'hidden'}>
			<View
				column_index={column_index}
				view_index={view_index}
				module={view.module}
				id={view.id}
				width={width}
				click={click}
			></View>
		</Activity>
	)
}

export default $app.memo(Index)
