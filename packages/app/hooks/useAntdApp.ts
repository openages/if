import { App } from 'antd'
import { useLayoutEffect } from 'react'

export default () => {
	const staticFunction = App.useApp()

	useLayoutEffect(() => {
		$message = staticFunction.message
		$modal = staticFunction.modal
		$notification = staticFunction.notification
	}, [staticFunction])
}
