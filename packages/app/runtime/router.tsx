import { createHashRouter } from 'react-router-dom'

import { ErrorBoundary, LazyElement } from '@/components'
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
		element: <LazyElement type='modules' path='note/page' />
	},
	{
		path: '/pomo',
		element: <LazyElement type='modules' path='pomo/page' />
	},
	{
		path: '/schedule',
		element: <LazyElement type='modules' path='schedule/page' />
	},
	{
		path: '/tray',
		element: <LazyElement type='windows' path='tray' />
	}
]

export default createHashRouter([
	{
		path: '/',
		element: <Layout />,
		children: routes,
		ErrorBoundary
	}
])
