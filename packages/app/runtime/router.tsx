import { createHashRouter } from 'react-router-dom'

import { LazyElement } from '@/components'
import Layout from '@/layout'

import type { RouteObject } from 'react-router-dom'

const routes: Array<RouteObject> = [
	{
		path: 'a',
		element: <LazyElement type='pages' path='A' />
	},
	{
		path: 'b',
		element: <LazyElement type='pages' path='B' />
	},
	{
		path: 'c',
		element: <LazyElement type='pages' path='C' />
	}
]

export default createHashRouter([
	{
		path: '/',
		element: <Layout />,
		children: routes
	}
])
