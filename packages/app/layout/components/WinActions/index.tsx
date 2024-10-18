import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'

import { useGlobal } from '@/context/app'
import { ipc } from '@/utils'
import { Copy, Minus, Square, X } from '@phosphor-icons/react'

import styles from './index.css'

const Index = () => {
	const global = useGlobal()

	const minimize = useMemoizedFn(() => ipc.app.actions.query({ type: 'minimize' }))
	const maximize = useMemoizedFn(() => ipc.app.actions.query({ type: 'maximize' }))
	const close = useMemoizedFn(() => ipc.app.actions.query({ type: 'close' }))

	return (
		<div className={$cx('flex no_drag', styles._local)}>
			<div className='win_option h_100 flex justify_center align_center' onClick={minimize}>
				<Minus weight='bold'></Minus>
			</div>
			<div className='win_option h_100 flex justify_center align_center' onClick={maximize}>
				{global.layout.maximize ? <Copy weight='bold'></Copy> : <Square weight='bold'></Square>}
			</div>
			<div className='win_option h_100 flex justify_center align_center' onClick={close}>
				<X size={15} weight='bold'></X>
			</div>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
