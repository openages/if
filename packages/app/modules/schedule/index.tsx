import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useRef, useState } from 'react'
import { match } from 'ts-pattern'
import { container as model_container } from 'tsyringe'

import { CalendarView, DateScale, Header, SettingsModal, TaskPanel, Timeline, TimelineView } from './components'
import styles from './index.css'
import Model from './model'

import type { IProps, IPropsDateScale, IPropsHeader, IPropsCalendarView } from './types'

const Index = ({ id }: IProps) => {
	const [x] = useState(() => model_container.resolve(Model))
	const container = useRef<HTMLDivElement>(null)
	const days = $copy(x.days)

	useLayoutEffect(() => {
		x.init({ id })

		return () => x.off()
	}, [id])

	const props_header: IPropsHeader = {
		view: x.view,
		scale: x.scale,
		current: x.current,
		visible_task_panel: x.visible_task_panel,
		step: useMemoizedFn(x.step),
		toggleVisibleTaskPanel: useMemoizedFn(() => (x.visible_task_panel = !x.visible_task_panel)),
		changeView: useMemoizedFn((v: Model['view']) => (x.view = v)),
		changeScale: useMemoizedFn((v: Model['scale']) => (x.scale = v)),
		changeCurrent: useMemoizedFn((v: Model['current']) => (x.current = v))
	}

	const props_date_scale: IPropsDateScale = {
		scale: x.scale,
		days
	}

	const props_calendar_view: IPropsCalendarView = {
		container,
		view: x.view,
		scale: x.scale,
		calendar_days: $copy(x.calendar_days),
		addTimeBlock: useMemoizedFn(x.addTimeBlock),
		updateTimeBlock: useMemoizedFn(x.updateTimeBlock)
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
					<div className={$cx('flex', styles.view_wrap)} ref={container}>
						<Timeline></Timeline>
						<div className={$cx('flex', styles.view)}>
							{match(x.view)
								.with('calendar', () => (
									<CalendarView {...props_calendar_view}></CalendarView>
								))
								.with('timeline', () => <TimelineView></TimelineView>)
								.with('fixed', () => <TimelineView></TimelineView>)
								.exhaustive()}
						</div>
					</div>
				</div>
			</div>
			<SettingsModal></SettingsModal>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
