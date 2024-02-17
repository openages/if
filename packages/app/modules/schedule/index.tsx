import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { match } from 'ts-pattern'
import { container } from 'tsyringe'

import { Add, CalendarView, FixedView, Header, SettingsModal, TaskPanel, TimelineView } from './components'
import styles from './index.css'
import Model from './model'

import type { IProps } from './types'

const Index = ({ id }: IProps) => {
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.init({ id })

		return () => x.off()
	}, [id])

	return (
		<div className={$cx('w_100 h_100 border_box flex flex_column', styles._local)}>
			<Header></Header>
			<div className={$cx('flex', styles.content)}>
				<TaskPanel></TaskPanel>
				{match(x.view)
					.with('calendar', () => <CalendarView></CalendarView>)
					.with('timeline', () => <TimelineView></TimelineView>)
					.with('fixed', () => <FixedView></FixedView>)
					.exhaustive()}
			</div>
			<Add></Add>
			<SettingsModal></SettingsModal>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
