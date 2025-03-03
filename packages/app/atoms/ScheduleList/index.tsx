import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { container } from 'tsyringe'

import { Show } from '@/components'
import { useStackEffect } from '@/hooks'

import { Calendar, Header, Items } from './components'
import styles from './index.css'
import Model from './model'

import type { IPropsList, IPropsHeader, IPropsItems, IPropsCalendar } from './types'

const Index = (props: IPropsList) => {
	const { id, use_by_tray, setToggleCalendarHandler, jump } = props
	const [x] = useState(() => container.resolve(Model))

	const { setDom } = useStackEffect({
		mounted: () => x.init({ id, use_by_tray, setToggleCalendarHandler }),
		unmounted: () => x.off(),
		deps: [id, use_by_tray, setToggleCalendarHandler]
	})

	const props_header: IPropsHeader = {
		list_duration: x.list_duration,
		list_current_text: x.list_current_text,
		list_custom_duration: $copy(x.list_custom_duration),
		total: x.list_items.length,
		setListDuration: useMemoizedFn(x.setListDuration),
		prev: useMemoizedFn(() => x.listStep('prev')),
		next: useMemoizedFn(() => x.listStep('next')),
		setListCustomDuration: useMemoizedFn(x.setListCustomDuration),
		exportListToExcel: useMemoizedFn(x.exportListToExcel)
	}

	const props_calendar: IPropsCalendar = {
		list_current_text: x.list_current_text,
		calendar_month_text: x.calendar_month_text,
		days: $copy(x.days),
		changeCurrentDate: useMemoizedFn(x.changeCurrentDate),
		changeCalendarMonth: useMemoizedFn(x.changeCalendarMonth)
	}

	const props_items: IPropsItems = {
		use_by_tray,
		list_items: $copy(x.list_items),
		tags: $copy(x.tags),
		jump
	}

	return (
		<div
			className={$cx('w_100 h_100 flex flex_column', styles._local, use_by_tray && styles.use_by_tray)}
			ref={setDom}
		>
			<Choose>
				<When condition={Boolean(use_by_tray)}>
					<Show visible={x.visible_calendar} height>
						<Calendar {...props_calendar}></Calendar>
					</Show>
				</When>
				<Otherwise>
					<Header {...props_header}></Header>
				</Otherwise>
			</Choose>
			<Items {...props_items}></Items>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
