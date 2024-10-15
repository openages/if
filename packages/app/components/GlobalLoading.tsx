import { useMemoizedFn } from 'ahooks'
import { useEffect, useState } from 'react'

import Loading from './Loading'

interface IProps {
	visible?: boolean
}

type State = { visible: boolean; desc?: string; showClose?: boolean }

const Index = (props: IProps) => {
	const { visible } = props
	const [state, setState] = useState<State>(() => ({ visible: visible || false, desc: '' }))
	const [visible_close, setVisibleClose] = useState(false)

	const setLoading = useMemoizedFn(({ visible, desc, showClose }: State) =>
		setState({ visible, desc: visible && desc ? desc : '', showClose })
	)

	const onClose = useMemoizedFn(() => {
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

	return state.visible ? <Loading desc={state.desc} close={visible_close ? onClose : undefined}></Loading> : null
}

export default $app.memo(Index)
