import { useMemoizedFn } from 'ahooks'
import { Popover, InputNumber, Switch, Radio } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { HourglassMedium } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsInputCircle } from '../../types'
const { Group } = Radio

const Index = (props: IPropsInputCircle) => {
	const { cycle_enabled, cycle = { scale: 'day', interval: 1 }, useByDetail, onChangeCircle } = props
	const { t, i18n } = useTranslation()
	const every_text = t(`translation:todo.Input.Cycle.every`)
	const scale_text = t(`translation:todo.Input.Cycle.options.${cycle.scale}`)

	const options_cycle = useMemo(
		() => [
			{ label: t('translation:todo.Input.Cycle.options.minite'), value: 'minite' },
			{ label: t('translation:todo.Input.Cycle.options.hour'), value: 'hour' },
			{ label: t('translation:todo.Input.Cycle.options.day'), value: 'day' },
			{ label: t('translation:todo.Input.Cycle.options.week'), value: 'week' },
			{ label: t('translation:todo.Input.Cycle.options.month'), value: 'month' },
			{ label: t('translation:todo.Input.Cycle.options.season'), value: 'season' },
			{ label: t('translation:todo.Input.Cycle.options.year'), value: 'year' }
		],
		[i18n.language]
	)

	const onWeekday = useMemoizedFn((day: number) => {
		const raw_exclude = cycle?.exclude || []

		let target_exclude = [...raw_exclude]

		if (raw_exclude.includes(day)) {
			target_exclude = raw_exclude.filter((item) => item !== day)
		} else {
			target_exclude.push(day)
		}

		onChangeCircle({
			cycle: { ...cycle, exclude: target_exclude }
		})
	})

	const Exclude = (cycle.scale === 'week' || cycle.scale === 'season') && (
		<div className='weekdays flex justify_between mt_8'>
			{(cycle.scale === 'week' ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4]).map((item) => (
				<span
					className={$cx(
						'weekday flex justify_center align_center clickable',
						cycle.exclude && cycle.exclude?.includes(item) && 'exclude',
						cycle.scale === 'season' && 'season'
					)}
					key={item}
					onClick={() => onWeekday(item)}
				>
					{item}
				</span>
			))}
		</div>
	)

	const Content = (
		<div className='cycle_input_wrap border_box flex flex_column'>
			<div className='head_wrap flex justify_between align_center'>
				<div className='title_wrap flex align_center'>
					<span className='title mr_6'>{t('translation:todo.Input.Cycle.title')}</span>
				</div>
				<Switch
					className='switch'
					size='small'
					checked={cycle_enabled}
					onChange={(v) => onChangeCircle({ cycle_enabled: v })}
				></Switch>
			</div>
			<div className='cycle_input_items w_100 border_box flex flex_column'>
				<Group
					className='checkbox_group'
					size='small'
					options={options_cycle}
					value={cycle.scale}
					onChange={({ target: { value } }) => {
						onChangeCircle({
							cycle: { ...cycle, scale: value, interval: 1, exclude: [] }
						})
					}}
				></Group>
				<div className='cycle_wrap mt_6'>
					<InputNumber
						className='w_100'
						size='small'
						placeholder={t('translation:todo.Input.Cycle.cycle')}
						min={1}
						max={99}
						formatter={(value) => `${every_text}${value}${scale_text}`}
						parser={(value) => Number(value.replace(every_text, '').replace(scale_text, ''))}
						value={cycle.interval}
						onChange={(v) => onChangeCircle({ cycle: { ...cycle, interval: v } })}
					></InputNumber>
					{Exclude}
				</div>
			</div>
		</div>
	)

	const Trigger = useMemo(() => {
		if (!useByDetail) {
			return (
				<div
					className={$cx(
						'btn_cycle flex justify_center align_center clickable',
						cycle_enabled && 'cycle_enabled'
					)}
				>
					<HourglassMedium size={15}></HourglassMedium>
				</div>
			)
		}

		if (!cycle_enabled) {
			return <span className='not_enabled cursor_point'>{t('translation:todo.Input.Cycle.disabled')}</span>
		}

		if (!cycle) {
			return <span className='not_enabled cursor_point'>{t('translation:todo.Input.Cycle.unset')}</span>
		}

		return (
			<span className='cursor_point'>
				{`${t('translation:todo.Input.Cycle.every')} ${cycle.interval} ${scale_text}`}
				{cycle?.exclude?.length &&
					`, ${t('translation:todo.Input.Cycle.exclude')}${scale_text}${cycle.exclude.join(',')}`}
			</span>
		)
	}, [i18n.language, cycle_enabled, cycle, useByDetail])

	return (
		<div className={$cx(styles._local)}>
			<Popover trigger='click' placement={useByDetail ? 'bottomLeft' : 'top'} content={Content}>
				<div>{Trigger}</div>
			</Popover>
		</div>
	)
}

export default $app.memo(Index)
