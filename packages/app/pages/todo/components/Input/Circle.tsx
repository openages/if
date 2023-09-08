import { Popover, Slider, InputNumber, Switch } from 'antd'
import { cloneDeep } from 'lodash-es'
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
	const { circle = { enabled: false, value: [0, 0, 0] }, onChangeCircle } = props
	const { t, i18n } = useTranslation()

	const Content = (
		<div className='circle_input_wrap border_box flex flex_column'>
			<div className='title_wrap flex justify_between align_center'>
				<span className='text'>{t('translation:todo.Input.Circle.title')}</span>
				<Switch
					size='small'
					checked={circle.enabled}
					onChange={(v) => {
						const target = cloneDeep(circle)

						target.enabled = v

						onChangeCircle(target)
					}}
				></Switch>
			</div>
			<div className='circle_input_items w_100 border_box flex flex_column'>
				{inputs.map((item, index) => {
					const onChange = (v: number) => {
						const target = cloneDeep(circle)

						target.value[index] = v

						onChangeCircle(target)
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
								value={circle.value[index]}
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
								value={circle.value[index]}
								onChange={onChange}
							></InputNumber>
						</div>
					)
				})}
			</div>
		</div>
	)

	return (
		<div className={$cx(styles.circle)}>
			<Popover trigger='click' placement='top' content={Content}>
				<div className='btn_circle flex justify_center align_center clickable'>
					<HourglassMedium size={15}></HourglassMedium>
				</div>
			</Popover>
		</div>
	)
}

export default $app.memo(Index)
