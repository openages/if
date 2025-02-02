import Day from './Day'
import styles from './index.css'
import Month from './Month'
import Week from './Week'
import Year from './Year'

import type { IPropsChart, IPropsTypeChart } from '../../types'

const Index = (props: IPropsChart) => {
	const { type, index, chart_data, setIndex, setChartDom } = props

	const props_type_chart: IPropsTypeChart = {
		index,
		chart_data,
		setIndex,
		setChartDom
	}

	return (
		<div className={$cx(styles._local)}>
			{chart_data && chart_data.items && chart_data.items.length && (
				<Choose>
					<When condition={type === 'day'}>
						<Day {...props_type_chart}></Day>
					</When>
					<When condition={type === 'week'}>
						<Week {...props_type_chart}></Week>
					</When>
					<When condition={type === 'month'}>
						<Month {...props_type_chart}></Month>
					</When>
					<When condition={type === 'year'}>
						<Year {...props_type_chart}></Year>
					</When>
				</Choose>
			)}
		</div>
	)
}

export default $app.memo(Index)
