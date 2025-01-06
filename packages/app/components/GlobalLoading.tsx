import { useMemoizedFn } from 'ahooks'
import { useEffect, useState } from 'react'

import Loading from './Loading'

interface IProps {
	visible?: boolean
}

export type GlobalLoadingState = {
	visible: boolean
	desc?: string
	showClose?: boolean
	close_text?: string
	close?: () => void
}

const Index = (props: IProps) => {
	const { visible } = props
	const [state, setState] = useState<GlobalLoadingState>(() => ({ visible: visible || false, desc: '' }))
	const [visible_close, setVisibleClose] = useState(false)

	const setLoading = useMemoizedFn(({ visible, desc, showClose, close_text, close }: GlobalLoadingState) => {
		if (close_text) setVisibleClose(true)

		setState({ visible, desc: visible && desc ? desc : '', showClose, close_text, close })
	})

	const onClose = useMemoizedFn(() => {
		state?.close?.()
		setLoading({ visible: false })
	})

	useEffect(() => {
		if (!state?.showClose) return

		const timer = setTimeout(() => {
			setVisibleClose(true)
		}, 6000)

		return () => clearTimeout(timer)
	}, [state?.showClose])

	useEffect(() => {
		window.$app.Event.on('app/setLoading', setLoading)

		return () => window.$app.Event.off('app/setLoading', setLoading)
	}, [])

	return state.visible ? (
		<Loading
			desc={state.desc}
			close_text={state.close_text}
			close={visible_close ? onClose : undefined}
		></Loading>
	) : null
}

export default $app.memo(Index)
