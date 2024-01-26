import { useMemoizedFn } from 'ahooks'
import { motion, AnimatePresence } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { useGlobal } from '@/context/app'

import { Actions, Indicators, Session } from './components'
import styles from './index.css'
import Model from './model'

import type { IProps, IPropsActions, IPropsIndicators } from './types'

const Index = ({ id }: IProps) => {
	const [x] = useState(() => container.resolve(Model))
	const global = useGlobal()
	const sessions = $copy(x.data.sessions) || []

	useLayoutEffect(() => {
		x.init({ id })

		return () => x.off()
	}, [id])

	const props_actions: IPropsActions = {
		add: useMemoizedFn(x.add)
	}

	const props_indicators: IPropsIndicators = {
		view_index: x.view_index,
		index: x.data.index,
		counts: sessions.length,
		changeViewIndex: useMemoizedFn(x.changeViewIndex)
	}

	if (!x.data.file_id) return

	return (
		<div className={$cx('w_100 h_100 border_box flex flex_column', styles._local)}>
			<div className='sessions_wrap flex flex_column justify_center align_center'>
				<div className='session_items flex justify_center align_center relative'>
					<AnimatePresence initial={false} custom={x.view_direction}>
						{sessions.map(
							(item, idx) =>
								idx === x.view_index && (
									<Session
										item={item}
										is_dark_theme={global.setting.theme === 'dark'}
										name={x.file.data.name}
										view_direction={x.view_direction}
										key={item.id}
									></Session>
								)
						)}
					</AnimatePresence>
				</div>
				{props_indicators.counts > 1 && <Indicators {...props_indicators}></Indicators>}
			</div>
			<Actions {...props_actions}></Actions>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
