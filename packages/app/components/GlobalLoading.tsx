import { useMemoizedFn } from 'ahooks'
import { useEffect, useState } from 'react'

import Loading from './Loading'

interface IProps {
	visible?: boolean
}

type State = { visible: boolean; desc?: string }

const Index = (props: IProps) => {
	const { visible } = props
	const [state, setState] = useState<State>(() => ({ visible: visible || false, desc: '' }))

	const setLoading = useMemoizedFn(({ visible, desc }: State) =>
		setState({ visible, desc: visible && desc ? desc : '' })
	)

	useEffect(() => {
		window.$app.Event.on('app/setLoading', setLoading)

		return () => window.$app.Event.off('app/setLoading', setLoading)
	}, [])

	return state.visible ? <Loading desc={state.desc}></Loading> : null
}

export default $app.memo(Index)
