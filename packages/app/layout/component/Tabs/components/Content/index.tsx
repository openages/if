import { unstable_Activity as Activity, Fragment } from 'react'

import { LazyElement } from '@/components'

import type { IPropsTabsContent } from '../../../../types'

const Index = (props: IPropsTabsContent) => {
	const { stacks } = props

	return (
		<Fragment>
			{stacks.map((item) => (
				<Activity mode={item.is_active ? 'visible' : 'hidden'} key={item.id}>
					<LazyElement type='modules' path={item.module} params={{ id: item.id }} />
				</Activity>
			))}
		</Fragment>
	)
}

export default $app.memo(Index)
