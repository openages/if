import { createHashRouter } from 'react-router-dom'

import { LazyElement } from '@/components'
import Layout from '@/layout'

import type { RouteObject } from 'react-router-dom'

const routes: Array<RouteObject> = [
	{
		path: '/',
		element: <LazyElement type='pages' path='todo/page' />
	},
	{
		path: '/memo',
		element: <LazyElement type='pages' path='memo' />
	},
	{
		path: '/note',
		element: <LazyElement type='pages' path='note' />
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
