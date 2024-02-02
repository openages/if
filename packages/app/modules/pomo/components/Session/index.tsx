import { useMemoizedFn } from 'ahooks'
import { motion } from 'framer-motion'
import { pick } from 'lodash-es'
import { useMemo } from 'react'
import { Arc, Circle, Layer, Line, Stage, Text } from 'react-konva'

import { useCssVariable } from '@/hooks'
import { swipe_x } from '@/utils/variants'

import { useTimes } from '../../hooks'
import { getRotateLinePoints } from '../../utils'
import styles from './index.css'

import type { IPropsSession } from '../../types'
import type Konva from 'konva'

const size = 240
const radius = size / 2
const inner_radius = radius - 3
const text_width = 72
const text_x = (size - text_width) / 2

const Index = (props: IPropsSession) => {
	const { item, is_dark_theme, name, view_direction, changeViewIndex } = props
	const { title, work_time, break_time, flow_mode } = item
	const color = useCssVariable('--color_text_rgb')
	const color_bg = useCssVariable('--color_bg')
	const { target_work_time, target_break_time } = useTimes({ work_time, break_time })

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
		rotation: -90,
		fill: `rgba(${color},${is_dark_theme ? '0.6' : '1'})`
	} as Konva.ArcConfig

	const props_arc_break = {
		...props_arc,
		angle: break_angle,
		rotation: -90 + work_angle,
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
		points: getRotateLinePoints(props_arc.x, props_arc.y, radius - 4, 0),
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
		text: `${target_work_time.hours}:${target_work_time.minutes}`
	} as Konva.TextConfig

	const onDragEnd = useMemoizedFn((_, { offset, velocity }) => {
		const swipe = Math.abs(offset.x) * velocity.x

		if (swipe < -10000) changeViewIndex('left')
		if (swipe > 10000) changeViewIndex('right')
	})

	return (
		<motion.div
			className={$cx('cursor_point', styles._local)}
			custom={view_direction}
			variants={swipe_x}
			initial='enter'
			animate='center'
			exit='exit'
			transition={{
				x: { type: 'spring', stiffness: 300, damping: 30 },
				opacity: { duration: 0.2 }
			}}
			drag='x'
			dragConstraints={{ left: 0, right: 0 }}
			dragElastic={1}
			onDragEnd={onDragEnd}
		>
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
					<span className='time_item mr_6'>
						Work {target_work_time.hours}:{target_work_time.minutes}
					</span>
					<span className='time_item'>
						Break {target_break_time.hours}:{target_break_time.minutes}
					</span>
				</div>
			</div>
		</motion.div>
	)
}

export default $app.memo(Index)
