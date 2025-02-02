import { useMemoizedFn } from 'ahooks'
import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Chart, Header, List } from './components'
import styles from './index.css'
import Model from './model'

import type { IPropsHeader, IPropsChart, IPropsList } from './types'
interface IProps {
	id?: string
	type?: Model['type']
}

const Index = (props: IProps) => {
	const { id, type } = props
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.init({ id, type })
	}, [id, type])

	const props_header: IPropsHeader = {
		type: x.type,
		current: x.current,
		total: x.total,
		setType: useMemoizedFn(v => {
			x.current_date = dayjs()

			x.query(v)
		}),
		reset: useMemoizedFn(x.reset),
		prev: useMemoizedFn(x.prev),
		next: useMemoizedFn(x.next),
		share: useMemoizedFn(x.share)
	}

	const props_chart: IPropsChart = {
		type: x.type,
		index: $copy(x.index),
		chart_data: $copy(x.chart_data),
		setIndex: useMemoizedFn(x.setIndex),
		setChartDom: useMemoizedFn(v => (x.chart_dom = v))
	}

	const props_list: IPropsList = {
		data_items: $copy(x.data_items)
	}

	return (
		<div className={$cx(styles._local)}>
			<Header {...props_header}></Header>
			<Chart {...props_chart}></Chart>
			<List {...props_list}></List>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
