import { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { OffScreenOutlet } from '@/components'
import { usePageScrollRestoration } from '@/hooks'

const Index = () => {
      usePageScrollRestoration()

	return (
		<Fragment>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					position: 'fixed',
					zIndex: 100,
					background: 'white'
				}}
			>
				<Link to='/a'>A</Link>
				<Link to='/b'>B</Link>
				<Link to='/c'>C</Link>
			</div>
			<OffScreenOutlet />
		</Fragment>
	)
}

export default Index
