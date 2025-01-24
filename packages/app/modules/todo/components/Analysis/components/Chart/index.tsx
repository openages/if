import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import { init, use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { useEffect, useRef } from 'react'

import styles from './index.css'

import type { IPropsAnalysisChart } from '@/modules/todo/types'
import type { ComposeOption } from 'echarts/core'
import type { BarSeriesOption, LineSeriesOption, PieSeriesOption } from 'echarts/charts'
import type {
	GridComponentOption,
	DatasetComponentOption,
	TitleComponentOption,
	TooltipComponentOption,
	LegendComponentOption
} from 'echarts/components'

type Option = ComposeOption<
	| GridComponentOption
	| DatasetComponentOption
	| TitleComponentOption
	| TooltipComponentOption
	| LegendComponentOption
	| BarSeriesOption
	| LineSeriesOption
	| PieSeriesOption
>

use([
	SVGRenderer,
	GridComponent,
	DatasetComponent,
	LegendComponent,
	TitleComponent,
	TooltipComponent,
	BarChart,
	LineChart,
	PieChart
])

const bar_common_series: BarSeriesOption = {
	type: 'bar',
	barWidth: 12,
	barGap: 0,
	barMinHeight: 6,
	itemStyle: { borderRadius: [3, 3, 0, 0] }
}

const legend = {
	bottom: 8,
	textStyle: {
		fontSize: 10,
		color: 'var(--color_text_grey)'
	},
	icon: 'circle',
	itemWidth: 6,
	itemHeight: 6,
	itemGap: 12,
	itemStyle: {
		borderWidth: 0
	}
} as LegendComponentOption

const tooltip = {
	textStyle: { fontSize: 10 }
} as TooltipComponentOption

const Index = (props: IPropsAnalysisChart) => {
	const { trending } = props
	const ref_trending = useRef(null)
	const ref_ratio = useRef(null)

	useEffect(() => {
		if (!trending) return

		const chart_trending = init(ref_trending.current)
		const chart_ratio = init(ref_ratio.current)

		chart_trending.setOption({
			grid: {
				top: 24,
				bottom: 54,
				right: 24
			},
			legend,
			tooltip,
			xAxis: {
				type: 'category',
				data: trending.dates,
				axisLine: {
					lineStyle: { color: 'var(--color_bg_2)' }
				},
				axisLabel: {
					fontSize: 10,
					color: 'var(--color_text)'
				},
				axisTick: {
					show: false
				}
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					fontSize: 10
				},
				splitLine: {
					lineStyle: {
						color: 'var(--color_bg_2)'
					}
				}
			},
			series: [
				{
					name: 'create',
					data: trending.create,
					...bar_common_series
				},
				{
					name: 'done',
					data: trending.done,
					...bar_common_series
				},
				{
					name: 'close',
					data: trending.close,
					...bar_common_series
				},
				{
					type: 'line',
					name: 'done',
					data: trending.done.map(item => (item + 0.5) * 1.2),
					symbol: 'circle',
					symbolSize: 3,
					lineStyle: { width: 1 },
					tooltip: { show: false }
				}
			]
		} as Option)

		chart_ratio.setOption({
			legend,
			tooltip,
			series: [
				{
					name: 'ratio',
					type: 'pie',
					radius: ['30%', '60%'],
					center: ['50%', '48%'],
					label: {
						show: true,
						position: 'inside',
						formatter: '{c}',
						fontSize: 10,
						backgroundColor: 'var(--color_bg)',
						color: 'var(--color_text)',
						borderRadius: 6,
						padding: 3
					},
					itemStyle: {
						borderRadius: 6,
						borderColor: 'var(--color_bg_1)',
						borderWidth: 2
					},
					data: [
						{ name: 'create', value: trending.create.at(-1) },
						{ name: 'done', value: trending.done.at(-1) },
						{ name: 'close', value: trending.close.at(-1) }
					]
				}
			]
		} as Option)

		return () => {
			chart_trending.dispose()
			chart_ratio.dispose()
		}
	}, [trending])

	return (
		<div className={$cx(styles._local)}>
			<div className='charts_wrap w_100 flex justify_between'>
				<div className='trending chart_ref' ref={ref_trending}></div>
				<div className='ratio chart_ref' ref={ref_ratio}></div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
