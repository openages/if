import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import { init, use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { sum } from 'lodash-es'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

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

const common_series: LineSeriesOption = {
	type: 'line',
	smooth: true
}

const legend = {
	top: 9,
	textStyle: {
		fontSize: 10,
		color: 'var(--color_text_grey)'
	},
	icon: 'circle',
	itemWidth: 6,
	itemHeight: 6,
	itemGap: 30,
	itemStyle: {
		borderWidth: 0
	}
} as LegendComponentOption

const tooltip = {
	textStyle: { fontSize: 10 }
} as TooltipComponentOption

const Index = (props: IPropsAnalysisChart) => {
	const { trending } = props
	const ref_trending = useRef<HTMLDivElement>(null)
	const ref_ratio = useRef<HTMLDivElement>(null)
	const { t } = useTranslation()

	useEffect(() => {
		if (!trending) return

		const chart_trending = init(ref_trending.current)
		const chart_ratio = init(ref_ratio.current)

		chart_trending.setOption({
			grid: {
				top: 42,
				bottom: 30,
				left: 30,
				right: 30
			},
			legend: {
				...legend,
				formatter: name =>
					`${t(`todo.Analysis.${name as keyof Omit<typeof trending, 'dates'>}`)} ${sum(trending[name as keyof typeof trending])}`
			},
			tooltip: {
				...tooltip,
				trigger: 'axis'
			},
			xAxis: {
				type: 'category',
				data: trending.dates,
				boundaryGap: false,
				axisLine: {
					lineStyle: { color: 'var(--color_bg_2)' }
				},
				axisLabel: {
					fontSize: 10,
					color: 'var(--color_text_light)'
				},
				axisTick: {
					show: false
				}
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					show: false,
					fontSize: 10,
					color: 'var(--color_text_light)'
				},
				splitLine: {
					lineStyle: {
						type: 'dashed',
						color: 'var(--color_bg_2)'
					}
				}
			},
			series: [
				{
					name: 'create',
					data: trending.create,
					...common_series
				},
				{
					name: 'done',
					data: trending.done,
					...common_series,
					type: 'bar',
					barWidth: 12,
					barMinHeight: 6,
					itemStyle: {
						borderRadius: [6, 6, 0, 0]
					}
				},
				{
					name: 'uncheck',
					data: trending.uncheck,
					...common_series
				},
				{
					name: 'close',
					data: trending.close,
					color: 'var(--color_border)',
					...common_series
				}
			]
		} as Option)

		const total =
			trending.create.at(-1)! + trending.done.at(-1)! + trending.uncheck.at(-1)! + trending.close.at(-1)!

		chart_ratio.setOption({
			legend: {
				...legend,
				orient: 'vertical',
				top: 'center',
				right: 12,
				itemGap: 12,
				formatter: name => {
					const v = trending[name as keyof typeof trending].at(-1)! as number
					const percent = ((v * 100) / (total || 1)).toFixed(0)

					return `${t(`todo.Analysis.${name as keyof Omit<typeof trending, 'dates'>}`)} ${v} (${percent}%)`
				}
			},
			series: [
				{
					name: 'ratio',
					type: 'pie',
					radius: ['24%', '54%'],
					center: ['27%', '50%'],
					label: {
						show: false
					},
					itemStyle: {
						borderRadius: 6,
						borderColor: 'var(--color_bg_1)',
						borderWidth: 2
					},
					data: [
						{ name: 'create', value: trending.create.at(-1) },
						{ name: 'done', value: trending.done.at(-1) },
						{ name: 'uncheck', value: trending.uncheck.at(-1) },
						{
							name: 'close',
							value: trending.close.at(-1),
							itemStyle: { color: 'var(--color_border)' },
							emphasis: {
								itemStyle: { color: 'var(--color_text_light)' }
							}
						}
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
