import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { match } from 'ts-pattern'
import { container } from 'tsyringe'

import { CalendarView, DateScale, Header, SettingsModal, TaskPanel, TimelineView } from './components'
import styles from './index.css'
import Model from './model'

import type { IProps, IPropsDateScale, IPropsHeader } from './types'
const Index = ({ id }: IProps) => {
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.init({ id })

		return () => x.off()
	}, [id])

	const props_header: IPropsHeader = {
		view: x.view,
		scale: x.scale,
		current: x.current,
		visible_task_panel: x.visible_task_panel,
		step: useMemoizedFn(x.step)
	}

	const props_date_scale: IPropsDateScale = {
		scale: x.scale,
		weekdays: $copy(x.weekdays)
	}

	return (
		<div className={$cx('w_100 h_100 border_box flex flex_column', styles._local)}>
			<Header {...props_header}></Header>
			<div className={$cx('flex', styles.content)}>
				{x.visible_task_panel && <TaskPanel></TaskPanel>}
				<div
					className={$cx(
						'h_100 flex flex_column',
						styles.schedule,
						x.visible_task_panel && styles.visible_task_panel
					)}
				>
					<DateScale {...props_date_scale}></DateScale>
					<div className={$cx('flex', styles.view_wrap)}>
						{match(x.view)
							.with('calendar', () => <CalendarView></CalendarView>)
							.with('timeline', () => <TimelineView></TimelineView>)
							.with('fixed', () => <TimelineView></TimelineView>)
							.exhaustive()}
					</div>
				</div>
			</div>
			<SettingsModal></SettingsModal>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
