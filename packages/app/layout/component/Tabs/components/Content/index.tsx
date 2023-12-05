import { Fragment, unstable_Activity as Activity } from 'react'
import View from '../View'

import type { IPropsTabsContent } from '../../../../types'

const Index = (props: IPropsTabsContent) => {
	const { stacks } = props

	return (
		<Fragment>
			{stacks.map(item => (
				<Activity mode={item.is_active ? 'visible' : 'hidden'} key={item.id}>
					<View module={item.module} id={item.id}></View>
				</Activity>
			))}
		</Fragment>
	)
}

export default $app.memo(Index)
