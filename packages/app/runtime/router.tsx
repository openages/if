import { createHashRouter } from 'react-router-dom'

import { LazyElement } from '@/components'
import Layout from '@/layout'

import type { RouteObject } from 'react-router-dom'

const routes: Array<RouteObject> = [
	{
		path: '/',
		element: <LazyElement type='pages' path='index/page' />
	},
	{
		path: '/setting',
		element: <LazyElement type='pages' path='setting' />
	}
]

export default createHashRouter([
	{
		path: '/',
		element: <Layout />,
		children: routes
	}
])
