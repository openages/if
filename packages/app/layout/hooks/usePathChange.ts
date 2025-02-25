import { contextMenu } from 'react-contexify'
import { useLocation } from 'react-router-dom'

import { useCreateLayoutEffect } from '@/hooks'

export default () => {
	const { pathname } = useLocation()

	useCreateLayoutEffect(() => {
		contextMenu.hideAll()
	}, [pathname])
}
