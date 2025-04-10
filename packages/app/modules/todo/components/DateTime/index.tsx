import { useMemoizedFn } from 'ahooks'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { format } from '@/utils/date'
import { Bell } from '@phosphor-icons/react'

import styles from './index.css'

import type { Dayjs } from 'dayjs'
import type { IPropsDateTime } from '../../types'

const Index = (props: IPropsDateTime) => {
	const { value, useByDetail, ignoreDetail, Icon, onFocus, onChange } = props
	const { t, i18n } = useTranslation()

	const status = useMemo(() => {
		if (!value) return
		if (dayjs(value).valueOf() < new Date().valueOf()) return 'outdate'
		if (dayjs(value).diff(dayjs(), 'hour') <= 12) return 'close'
	}, [value])

	const options = useMemo(() => {
		const now = dayjs()

		return [
			{ label: t('todo.Input.Remind.options.two_hour'), value: now.add(2, 'hour') },
			{ label: t('todo.Input.Remind.options.half_day'), value: now.add(6, 'hour') },
			{ label: t('todo.Input.Remind.options.day'), value: now.add(1, 'day') },
			{ label: t('todo.Input.Remind.options.after_tomorrow'), value: now.add(2, 'day') },
			{ label: t('todo.Input.Remind.options.three_day'), value: now.add(3, 'day') },
			{ label: t('todo.Input.Remind.options.week'), value: now.add(1, 'week') },
			{ label: t('todo.Input.Remind.options.half_month'), value: now.add(15, 'day') },
			{ label: t('todo.Input.Remind.options.month'), value: now.add(1, 'month') },
			{ label: t('todo.Input.Remind.options.half_year'), value: now.add(6, 'month') },
			{ label: t('todo.Input.Remind.options.year'), value: now.add(1, 'year') }
		]
	}, [i18n.language])

	const Trigger = useMemo(
		() => (
			<div className={$cx('btn_clock flex justify_center align_center clickable', !!value && 'has_value')}>
				{Icon ? <Icon size={16}></Icon> : <Bell size={15}></Bell>}
			</div>
		),
		[value]
	)

	const onChangeTime = useMemoizedFn((v: Dayjs) => {
		if (!v) return onChange(undefined as unknown as number)
		if (v.valueOf() <= dayjs().valueOf()) return

		onChange(v.startOf('minute').valueOf())
	})

	const formatIgnoreDetail = useMemoizedFn(v => format(v, true)!)

	return (
		<DatePicker
			rootClassName={$cx(
				'disable_second',
				styles._local,
				!useByDetail && styles.useByInput,
				ignoreDetail && styles.ignoreDetail,
				status === 'outdate' && styles.outdate,
				status === 'close' && styles.close
			)}
			placement={useByDetail ? 'bottomLeft' : 'topRight'}
			placeholder={t('common.unset')}
			showTime={{ defaultValue: dayjs().startOf('minute') }}
			suffixIcon={useByDetail ? false : Trigger}
			variant='borderless'
			disabledDate={v => v && v <= dayjs().startOf('day')}
			getPopupContainer={() => document.body}
			presets={options}
			format={ignoreDetail ? formatIgnoreDetail : format}
			value={value ? dayjs(value) : undefined}
			onOpenChange={onFocus}
			onChange={onChangeTime}
		></DatePicker>
	)
}

export default $app.memo(Index)
