import { createHashRouter } from 'react-router-dom'

import { LazyElement } from '@/components'
import Layout from '@/layout'

import type { RouteObject } from 'react-router-dom'

const routes: Array<RouteObject> = [
	{
		path: '/',
		element: <LazyElement type='modules' path='todo/page' />
	},
	{
		path: '/memo',
		element: <LazyElement type='modules' path='memo' />
	},
	{
		path: '/note',
		element: <LazyElement type='modules' path='note' />
	},
	{
		path: '/setting',
		element: <LazyElement type='modules' path='setting' />
	}
]

export default createHashRouter([
	{
		path: '/',
		element: <Layout />,
		children: routes
	}
])
