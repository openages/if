import { useMemoizedFn } from 'ahooks'
import { AnimatePresence } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { useGlobal } from '@/context/app'

import { Actions, Indicators, Session, SessionsEditModal } from './components'
import styles from './index.css'
import Model from './model'

import type { IProps, IPropsActions, IPropsIndicators, IPropsSessionsEditModal } from './types'

const Index = ({ id }: IProps) => {
	const [x] = useState(() => container.resolve(Model))
	const global = useGlobal()
	const data = $copy(x.data)
	const sessions = $copy(x.data.sessions) || []
	const add = useMemoizedFn(x.add)

	useLayoutEffect(() => {
		x.init({ id })

		return () => x.off()
	}, [id])

	const props_actions: IPropsActions = {
		going: x.data.going,
		continuous_mode: x.data.continuous_mode,
		flow_mode: sessions[x.data.index]?.flow_mode,
		add,
		toggleGoing: useMemoizedFn(x.toggleGoing),
		next: useMemoizedFn(x.next),
		toggleContinuousMode: useMemoizedFn(x.toggleContinuousMode),
		toggleEditModal: useMemoizedFn(() => (x.visible_edit_modal = !x.visible_edit_modal))
	}

	const props_indicators: IPropsIndicators = {
		view_index: x.view_index,
		index: x.data.index,
		counts: sessions.length,
		changeViewIndex: useMemoizedFn(x.changeViewIndex)
	}

	const props_sessions_edit_modal: IPropsSessionsEditModal = {
		visible_edit_modal: x.visible_edit_modal,
		data: $copy(x.data),
		update: useMemoizedFn(x.update),
		remove: useMemoizedFn(x.remove),
		move: useMemoizedFn(x.move),
		close: useMemoizedFn(() => (x.visible_edit_modal = false))
	}

	if (!x.data.file_id) return null

	return (
		<div
			className={$cx(
				'w_100 h_100 border_box',
				styles._local,
				x.visible_edit_modal && styles.visible_edit_modal
			)}
		>
			<div className='page_content_wrap w_100 h_100 border_box flex flex_column'>
				<div className='sessions_wrap flex flex_column justify_center align_center'>
					<div className='session_items flex justify_center align_center relative'>
						<AnimatePresence initial={false} custom={x.view_direction}>
							{sessions.map(
								(item, idx) =>
									idx === x.view_index && (
										<Session
											data={data}
											item={item}
											is_dark_theme={global.setting.theme === 'dark'}
											should_show_current={x.data.index === x.view_index}
											name={x.file.data.name}
											view_direction={x.view_direction}
											changeViewIndex={props_indicators.changeViewIndex}
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
			<SessionsEditModal {...props_sessions_edit_modal}></SessionsEditModal>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
