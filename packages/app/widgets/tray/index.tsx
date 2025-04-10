import { useMemoizedFn } from 'ahooks'
import { Tabs } from 'antd'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useRef, useState } from 'react'
import { container } from 'tsyringe'

import { ScheduleList, TodosPanel } from '@/atoms'
import { ModuleIcon } from '@/components'
import { AppWindow, ArrowClockwise, CalendarDots, Power } from '@phosphor-icons/react'

import styles from './index.css'
import Model from './model'

import type { ReactElement } from 'react'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))
	const toggle_calendar = useRef<() => void>()

	useLayoutEffect(() => {
		x.init()

		return () => x.off()
	}, [])

	const setToggleCalendarHandler = useMemoizedFn(fn => {
		toggle_calendar.current = fn
	})

	const toggleCalendar = useMemoizedFn(() => toggle_calendar.current?.())

	return (
		<div className={$cx('w_100 h_100 border_box flex flex_column', styles._local)}>
			<div className={$cx('w_100 border_box flex justify_between align_center is_drag', styles.header)}>
				<div className='view_wrap flex align_center no_drag'>
					<span
						className={$cx(
							'btn_action flex justify_center align_center clickable',
							x.view === 'todo' && 'active'
						)}
						onClick={() => (x.view = 'todo')}
					>
						<ModuleIcon type='todo'></ModuleIcon>
					</span>
					<span className='divider'></span>
					<span
						className={$cx(
							'btn_action flex justify_center align_center clickable',
							x.view === 'schedule' && 'active'
						)}
						onClick={() => (x.view = 'schedule')}
					>
						<ModuleIcon type='schedule'></ModuleIcon>
					</span>
				</div>
				<div className='actions_wrap flex align_center no_drag'>
					<If condition={x.schedule_active && x.view === 'schedule'}>
						<div
							className='btn_action flex justify_center align_center clickable'
							onClick={toggleCalendar}
						>
							<CalendarDots></CalendarDots>
						</div>
					</If>
					<div
						className='btn_action flex justify_center align_center clickable'
						onClick={x.toWidget}
					>
						<AppWindow></AppWindow>
					</div>
					<div
						className='btn_action flex justify_center align_center clickable'
						onClick={x.exitApp}
					>
						<Power></Power>
					</div>
				</div>
			</div>
			<Tabs
				className='h_100'
				activeKey={x.view}
				destroyInactiveTabPane
				items={[
					{
						key: 'todo',
						label: 'todo',
						children: (
							<If
								condition={
									x.todo_active &&
									Boolean(x.todo_file_id) &&
									Boolean(x.todo_angle_id)
								}
							>
								<TodosPanel
									file_id={x.todo_file_id}
									angle_id={x.todo_angle_id}
								></TodosPanel>
							</If>
						)
					},
					{
						key: 'schedule',
						label: 'schedule',
						children: (
							<If condition={x.schedule_active && Boolean(x.schedule_file_id)}>
								<ScheduleList
									id={x.schedule_file_id}
									use_by_tray
									setToggleCalendarHandler={setToggleCalendarHandler}
								></ScheduleList>
							</If>
						)
					}
				]}
				renderTabBar={() => null as unknown as ReactElement}
			></Tabs>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
