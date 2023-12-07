import { unstable_Activity as Activity } from 'react'
import View from '../View'

import type { IPropsStacksContentView } from '../../../../types'

const Index = (props: IPropsStacksContentView) => {
	const { view } = props

	return (
		<Activity mode={view.active ? 'visible' : 'hidden'}>
			<View module={view.module} id={view.id}></View>
		</Activity>
	)
}

export default $app.memo(Index)
