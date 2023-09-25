import { unstable_Offscreen as Offscreen, Fragment } from 'react'

import { LazyElement } from '@/components'

import type { IPropsTabsContent } from '../../../../types'

const Index = (props: IPropsTabsContent) => {
	const { stacks } = props

	return (
		<Fragment>
			{stacks.map((item) => (
				<Offscreen mode={item.is_active ? 'visible' : 'hidden'} key={item.id}>
					<LazyElement type='modules' path={item.module} params={{ id: item.id }} />
				</Offscreen>
			))}
		</Fragment>
	)
}

export default $app.memo(Index)
