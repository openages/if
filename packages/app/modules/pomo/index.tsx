import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { useGlobal } from '@/context/app'

import { Actions, Session } from './components'
import styles from './index.css'
import Model from './model'

import type { IProps } from './types'

const Index = ({ id }: IProps) => {
	const [x] = useState(() => container.resolve(Model))
	const global = useGlobal()
	const sessions = $copy(x.data.sessions) || []

	useLayoutEffect(() => {
		x.init({ id })

		return () => x.off()
	}, [id])

	return (
		<div className={$cx('w_100 h_100 border_box flex flex_column', styles._local)}>
			<div className='sessions_wrap flex justify_center align_center'>
				<div className='session_items flex'>
					{sessions.map(item => (
						<Session
							item={item}
							is_dark_theme={global.setting.theme === 'dark'}
							name={x.file.data.name}
							state={x.state}
							key={item.id}
						></Session>
					))}
				</div>
			</div>
			<Actions></Actions>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
