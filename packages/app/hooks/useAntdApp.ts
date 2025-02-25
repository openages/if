import { App } from 'antd'

import { useCreateLayoutEffect } from '@/hooks'

export default () => {
	const staticFunction = App.useApp()

	useCreateLayoutEffect(() => {
		$message = staticFunction.message
		$modal = staticFunction.modal
		$notification = staticFunction.notification
	}, [staticFunction])
}
