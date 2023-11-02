import { Popover, Slider, InputNumber, Switch } from 'antd'
import { cloneDeep } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { HourglassMedium } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsInputCircle } from '../../types'
const inputs = [
	{
		label: 'day',
		max: 365,
		unit: 'd'
	},
	{
		label: 'hour',
		max: 24,
		unit: 'h'
	},
	{
		label: 'minute',
		max: 60,
		unit: 'm'
	}
] as const

const Index = (props: IPropsInputCircle) => {
	const { circle_enabled, circle_value = [], useByDetail, onChangeCircle } = props
	const { t, i18n } = useTranslation()

	const Content = (
		<div className='circle_input_wrap border_box flex flex_column'>
			<div className='title_wrap flex justify_between align_center'>
				<span className='text'>{t('translation:todo.Input.Circle.title')}</span>
				<Switch
					size='small'
					checked={circle_enabled}
					onChange={(v) => onChangeCircle({ circle_enabled: v })}
				></Switch>
			</div>
			<div className='circle_input_items w_100 border_box flex flex_column'>
				{inputs.map((item, index) => {
					const onChange = (v: number) => {
						const target = cloneDeep(circle_value)

						target[index] = v

						onChangeCircle({ circle_value: target })
					}

					return (
						<div
							className={$cx(
								'circle_input_item w_100 border_box flex align_center',
								i18n.language
							)}
							key={item.label}
						>
							<span className='label'>
								{t(`translation:todo.Input.Circle.${item.label}`)}
							</span>
							<Slider
								className='slider'
								min={0}
								max={item.max}
								step={1}
								value={circle_value[index] || 0}
								onChange={onChange}
							></Slider>
							<InputNumber
								className='value'
								size='small'
								min={0}
								max={item.max}
								step={1}
								bordered={false}
								controls={false}
								formatter={(value) => `${value}${item.unit}`}
								parser={(value) => parseInt(value!.replace(item.unit, ''))}
								value={circle_value[index] || 0}
								onChange={onChange}
							></InputNumber>
						</div>
					)
				})}
			</div>
		</div>
	)

	const Trigger = useMemo(() => {
		if (!useByDetail) {
			return (
				<div className='btn_circle flex justify_center align_center clickable'>
					<HourglassMedium size={15}></HourglassMedium>
				</div>
			)
		}

		if (!circle_enabled) {
			return <span className='not_enabled cursor_point'>{t('translation:todo.Input.Circle.disabled')}</span>
		}

		if (!circle_value[0] && !circle_value[1] && !circle_value[2]) {
			return <span className='not_enabled cursor_point'>{t('translation:todo.Input.Circle.unset')}</span>
		}

		let target = ''

		if (circle_value[0]) target += circle_value[0] + t('translation:todo.Input.Circle.day') + '  '
		if (circle_value[1]) target += circle_value[1] + t('translation:todo.Input.Circle.hour') + '  '
		if (circle_value[2]) target += circle_value[2] + t('translation:todo.Input.Circle.minute')

		return <span className='cursor_point'>{target}</span>
	}, [i18n.language, circle_enabled, circle_value, useByDetail])

	return (
		<div className={$cx(styles.circle)}>
			<Popover trigger='click' placement={useByDetail?'bottomLeft':'top'} content={Content}>
				<div>{Trigger}</div>
			</Popover>
		</div>
	)
}

export default $app.memo(Index)
