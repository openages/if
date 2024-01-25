import { pick } from 'lodash-es'
import { useMemo } from 'react'
import { Arc, Circle, Layer, Line, Stage, Text } from 'react-konva'

import { useCssVariable } from '@/hooks'

import styles from './index.css'

import type { IPropsSession } from '../../types'
import type Konva from 'konva'

const size = 240
const radius = size / 2
const inner_radius = radius - 3
const text_width = 72
const text_x = (size - text_width) / 2

function getRotateLinePoints(x: number, y: number, length: number, deg: number) {
	const radius = (deg * Math.PI) / 180
	const target_x = x + length * Math.sin(radius)
	const target_y = y - length * Math.cos(radius)

	return [x, y, target_x, target_y]
}

const Index = (props: IPropsSession) => {
	const { item, is_dark_theme, name } = props
	const { title, work_time, break_time, done, flow_mode } = item
	const color = useCssVariable('--color_text_rgb')
	const color_bg = useCssVariable('--color_bg')

	const { work_angle, break_angle } = useMemo(() => {
		const total = work_time + break_time

		return {
			work_angle: (work_time / total) * 360,
			break_angle: (break_time / total) * 360
		}
	}, [work_time, break_time])

	const props_arc: Omit<Konva.ArcConfig, 'angle'> = {
		x: radius,
		y: radius,
		innerRadius: inner_radius,
		outerRadius: radius
	}

	const props_shadow = {
		shadowEnabled: true,
		shadowColor: `rgba(${color},0.18)`,
		shadowOffsetX: 3,
		shadowOffsetY: 3,
		shadowBlur: 12
	}

	const props_arc_work = {
		...props_arc,
		angle: work_angle,
		rotation: -break_angle,
		fill: `rgba(${color},${is_dark_theme ? '0.6' : '1'})`
	} as Konva.ArcConfig

	const props_arc_break = {
		...props_arc,
		angle: break_angle,
		rotation: -90 - break_angle,
		fill: `rgba(${color},0.${is_dark_theme ? '24' : '06'})`
	} as Konva.ArcConfig

	const props_circle_dot_bottom = {
		...pick(props_arc, ['x', 'y']),
		radius: 12,
		fill: `rgba(${color},0.${is_dark_theme ? '18' : '03'})`
	} as Konva.CircleConfig

	const props_circle_dot_top = {
		...pick(props_arc, ['x', 'y']),
		...props_shadow,
		radius: 6,
		fill: is_dark_theme ? `rgba(${color},1)` : color_bg
	} as Konva.CircleConfig

	const props_line = {
		...props_shadow,
		points: getRotateLinePoints(props_arc.x, props_arc.y, radius - 4, 90),
		stroke: is_dark_theme ? `rgba(${color},1)` : color_bg,
		strokeWidth: 6,
		lineCap: 'round'
	} as Konva.LineConfig

	const props_text_current = {
		x: text_x,
		y: 171,
		width: text_width,
		align: 'center',
		fontSize: 24,
		fontFamily: 'Avenir',
		fontStyle: 'bold',
		fill: `rgba(${color},1)`,
		text: '45:00'
	} as Konva.TextConfig

	return (
		<div className={$cx(styles._local)}>
			<Stage className='stage_wrap' width={size} height={size}>
				<Layer>
					<Arc {...props_arc_work}></Arc>
					<Arc {...props_arc_break}></Arc>
					<Circle {...props_circle_dot_bottom}></Circle>
					<Text {...props_text_current}></Text>
					<Line {...props_line}></Line>
					<Circle {...props_circle_dot_top}></Circle>
				</Layer>
			</Stage>
			<div className='title_wrap flex flex_column align_center'>
				<span className='title font_bold mb_10'>{title || name}</span>
				<div className='times'>
					<span className='time_item mr_6'>Work 45:00</span>
					<span className='time_item'>Break 15:00</span>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
