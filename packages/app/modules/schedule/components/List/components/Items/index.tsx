import { groupBy } from 'lodash-es'
import { useMemo } from 'react'

import { SimpleEmpty } from '@/components'

import CalendarItem from './CalendarItem'
import styles from './index.css'
import TimelineItem from './TimelineItem'

import type { IPropsListItems } from '../../../../types'

const Index = (props: IPropsListItems) => {
	const { list_items, tags, jump } = props

	const { timeline, calendar } = useMemo(() => {
		return groupBy(list_items, 'type')
	}, [list_items])

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			<Choose>
				<When condition={list_items.length === 0}>
					<div className='empty_wrap flex justify_center align_center'>
						<SimpleEmpty></SimpleEmpty>
					</div>
				</When>
				<Otherwise>
					<If condition={timeline && timeline.length > 0}>
						<div className='timeline_items w_100 border_box flex flex_column'>
							{timeline.map(item => (
								<TimelineItem {...{ item, tags, jump }} key={item.id}></TimelineItem>
							))}
						</div>
					</If>
					<If condition={calendar && calendar.length > 0}>
						<div className='calendar_items w_100 border_box flex flex_column'>
							{calendar.map(item => (
								<CalendarItem {...{ item, tags, jump }} key={item.id}></CalendarItem>
							))}
						</div>
					</If>
				</Otherwise>
			</Choose>
		</div>
	)
}

export default $app.memo(Index)
