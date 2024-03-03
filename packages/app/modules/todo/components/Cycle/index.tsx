import { useMemoizedFn } from 'ahooks'
import { DatePicker, InputNumber, Popover, Radio, Select, Switch as AntdSwitch, TimePicker } from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Case, Switch } from 'react-if'

import { getCycleSpecificDesc } from '@/utils/modules/todo'
import { Repeat } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsCircle } from '../../types'
import type { Dayjs } from 'dayjs'

const { Group } = Radio

const Index = (props: IPropsCircle) => {
	const { cycle_enabled, cycle, useByDetail, unEditing, onFocus, onChange, onChangeItem } = props
	const { t, i18n } = useTranslation()
	const [type, setType] = useState<IPropsCircle['cycle']['type']>(() => cycle?.type ?? 'interval')
	const every_text = t(`translation:todo.Input.Cycle.every`)
	const scale_text =
		cycle?.type === 'interval' && cycle?.scale ? t(`translation:todo.Input.Cycle.options.${cycle.scale}`) : ''

	const options_scale = useMemo(
		() =>
			type === 'interval'
				? [
						{ label: t('translation:todo.Input.Cycle.options.minute'), value: 'minute' },
						{ label: t('translation:todo.Input.Cycle.options.hour'), value: 'hour' },
						{ label: t('translation:todo.Input.Cycle.options.day'), value: 'day' },
						{ label: t('translation:todo.Input.Cycle.options.week'), value: 'week' },
						{ label: t('translation:todo.Input.Cycle.options.month'), value: 'month' },
						{ label: t('translation:todo.Input.Cycle.options.quarter'), value: 'quarter' },
						{ label: t('translation:todo.Input.Cycle.options.year'), value: 'year' },
						{ label: t('translation:todo.Input.Cycle.options.reset'), value: 'reset' }
				  ]
				: [
						{ label: t('translation:todo.Input.Cycle.specific.options.clock'), value: 'clock' },
						{
							label: t('translation:todo.Input.Cycle.specific.options.weekday'),
							value: 'weekday'
						},
						{ label: t('translation:todo.Input.Cycle.specific.options.date'), value: 'date' },
						{
							label: t('translation:todo.Input.Cycle.specific.options.special'),
							value: 'special'
						},
						{ label: t('translation:todo.Input.Cycle.options.reset'), value: 'reset' }
				  ],
		[i18n.language, type]
	)

	const onChangeType = useMemoizedFn(e => {
		const type = e.target.getAttribute('data-key')

		if (!type) return

		setType(type)

		onChange({ type, scale: undefined, value: undefined })
	})

	const onWeekday = useMemoizedFn((day: number) => {
		const raw_exclude = cycle?.exclude || []

		let target_exclude = [...raw_exclude]

		if (raw_exclude.includes(day)) {
			target_exclude = raw_exclude.filter(item => item !== day)
		} else {
			target_exclude.push(day)
		}

		onChange({ ...cycle, exclude: target_exclude })
	})

	const onChangeEnabled = useMemoizedFn(v => onChangeItem({ cycle_enabled: v }))

	const onChangeScale = useMemoizedFn(({ target: { value } }) => {
		if (value === 'reset') {
			setType('interval')
			onChange(undefined)

			return
		}

		onChange({
			...cycle,
			type,
			scale: value,
			value: type === 'interval' ? 1 : undefined,
			exclude: []
		})
	})

	const onChangeValue = useMemoizedFn(v => onChange({ ...cycle, value: v }))

	const onChangeDay = useMemoizedFn((v: Dayjs) =>
		onChange({ ...cycle, value: cycle.scale === 'date' ? v.date() : v.valueOf() })
	)

	const onChangeHour = useMemoizedFn((v: Dayjs) => onChange({ ...cycle, value: v.hour() }))

	const options_weekday = useMemo(() => {
		return [0, 1, 2, 3, 4, 5, 6].map(item => ({
			label: dayjs().day(item).format('dddd'),
			value: item
		}))
	}, [i18n.language])

	const Exclude = useMemo(
		() =>
			(cycle?.scale === 'week' || cycle?.scale === 'quarter') && (
				<div className='weekdays flex justify_between mt_8'>
					{(cycle?.scale === 'week' ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4]).map(item => (
						<span
							className={$cx(
								'weekday flex justify_center align_center clickable',
								cycle?.exclude && cycle?.exclude?.includes(item) && 'exclude',
								cycle?.scale === 'quarter' && 'quarter'
							)}
							key={item}
							onClick={() => onWeekday(item)}
						>
							{item}
						</span>
					))}
				</div>
			),
		[cycle?.scale, cycle?.exclude]
	)

	const Interval = useMemo(
		() =>
			cycle?.value && (
				<InputNumber
					className='w_100'
					size='small'
					placeholder={t('translation:todo.Input.Cycle.cycle')}
					min={1}
					max={99}
					formatter={value => `${every_text} ${value} ${scale_text}`}
					parser={value => Number(value.replace(every_text, '').replace(scale_text, '').trim())}
					value={cycle.value}
					onChange={onChangeValue}
				></InputNumber>
			),
		[every_text, scale_text, cycle?.value]
	)

	const Specific = useMemo(
		() =>
			cycle?.scale && (
				<Switch>
					<Case condition={cycle.scale === 'clock'}>
						<TimePicker
							className='w_100'
							inputReadOnly
							format='HH'
							value={cycle.value ? dayjs().hour(cycle.value) : undefined}
							onChange={onChangeHour}
						></TimePicker>
					</Case>
					<Case condition={cycle.scale === 'weekday'}>
						<Select
							className='w_100'
							size='small'
							placeholder={t('translation:todo.Input.Cycle.specific.options.weekday')}
							options={options_weekday}
							value={cycle.value !== undefined ? cycle.value : undefined}
							onChange={onChangeValue}
						></Select>
					</Case>
					<Case condition={cycle.scale === 'date' || cycle.scale === 'special'}>
						<DatePicker
							className='w_100'
							inputReadOnly
							format={cycle.scale === 'date' ? 'DD' : 'MM-DD'}
							value={
								cycle.scale === 'date'
									? cycle.value
										? dayjs().date(cycle.value)
										: undefined
									: cycle.value
									  ? dayjs(cycle.value)
									  : undefined
							}
							onChange={onChangeDay}
						></DatePicker>
					</Case>
				</Switch>
			),
		[cycle?.scale, cycle?.value]
	)

	const Content = (
		<div className='cycle_input_wrap border_box flex flex_column'>
			<div className='head_wrap flex justify_center align_center relative'>
				<div className='title_wrap flex align_center absolute'>
					<span className='title mr_6'>{t('translation:todo.Input.Cycle.title')}</span>
				</div>
				<div className='type_wrap flex' onClick={onChangeType}>
					<span
						className={$cx('type_item cursor_point clickable', type === 'interval' && 'active')}
						data-key='interval'
					>
						{t('translation:todo.Input.Cycle.type.interval')}
					</span>
					<span
						className={$cx('type_item cursor_point clickable', type === 'specific' && 'active')}
						data-key='specific'
					>
						{t('translation:todo.Input.Cycle.type.specific')}
					</span>
				</div>
				<AntdSwitch
					className='switch absolute'
					size='small'
					checked={cycle_enabled}
					onChange={onChangeEnabled}
				></AntdSwitch>
			</div>
			<div className='cycle_input_items w_100 border_box flex flex_column'>
				<Group
					className={$cx('radio_group', cycle?.type === 'specific' && 'specific')}
					size='small'
					options={options_scale}
					value={cycle?.scale}
					onChange={onChangeScale}
				></Group>
				{cycle?.scale && (
					<div className='cycle_wrap mt_6'>
						{type === 'interval' ? Interval : Specific}
						{Exclude}
					</div>
				)}
			</div>
		</div>
	)

	const Trigger = useMemo(() => {
		if (!useByDetail) {
			return (
				<div
					className={$cx(
						'btn_cycle flex justify_center align_center clickable',
						cycle_enabled && cycle && 'cycle_enabled'
					)}
				>
					<Repeat size={15}></Repeat>
				</div>
			)
		}

		if (!cycle_enabled) {
			return <span className='not_enabled cursor_point'>{t('translation:todo.Input.Cycle.disabled')}</span>
		}

		if (!cycle) {
			return <span className='not_enabled cursor_point'>{t('translation:common.unset')}</span>
		}

		if (cycle.type === 'interval') {
			if (!scale_text) {
				return (
					<span className='not_enabled cursor_point'>
						{t('translation:todo.Input.Cycle.disabled')}
					</span>
				)
			}

			return (
				<span className='cycle_desc cursor_point'>
					{`${t('translation:todo.Input.Cycle.every')} ${cycle?.value} ${scale_text}`}
					{cycle?.exclude?.length > 0 &&
						`, ${t('translation:todo.Input.Cycle.exclude')} ${cycle.exclude.join(',')}`}
				</span>
			)
		} else {
			if (cycle?.value === undefined) {
				return <span className='not_enabled cursor_point'>{t('translation:common.unset')}</span>
			}

			return <span className='cycle_desc cursor_point'>{getCycleSpecificDesc(cycle)}</span>
		}
	}, [i18n.language, cycle_enabled, cycle, useByDetail])

	return unEditing ? (
		<div className={styles.trigger_wrap}>{Trigger}</div>
	) : (
		<Popover
			rootClassName={styles._local}
			trigger='click'
			destroyTooltipOnHide
			placement={useByDetail ? 'bottom' : 'topRight'}
			content={Content}
			align={!useByDetail ? { offset: [8, -8] } : {}}
			getPopupContainer={() => document.body}
			onOpenChange={onFocus}
		>
			<div className={styles.trigger_wrap}>{Trigger}</div>
		</Popover>
	)
}

export default $app.memo(Index)
