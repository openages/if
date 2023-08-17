import { unstable_Offscreen as Offscreen, Fragment } from 'react'

import { LazyElement } from '@/components'

import type { IPropsTabsContent } from '../../../../types'

const Index = (props: IPropsTabsContent) => {
	const { stacks } = props

	return (
		<Fragment>
			{stacks.map((item) => (
				<Offscreen key={item.id} mode={item.is_active ? 'visible' : 'hidden'}>
					<LazyElement type='pages' path='index' params={{ id: item.id }} />
				</Offscreen>
			))}
		</Fragment>
	)
}

export default $app.memo(Index)
