import '@/global'
import '@/presets'

import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { is_dev } from '@/utils'

import router from './router'

createRoot(document.getElementById('root')!).render(<RouterProvider router={router}></RouterProvider>)

if (is_dev) {
	const root_el = document.getElementById('root')

	setTimeout(() => {
		const iframe = root_el?.nextElementSibling as HTMLIFrameElement

		if (iframe?.tagName === 'IFRAME') {
			iframe.remove()
		}
	}, 30)
}
