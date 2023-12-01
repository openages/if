import { Bell } from '@phosphor-icons/react'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './index.css'

import { useMemoizedFn } from 'ahooks'

import type { Dayjs } from 'dayjs'
import type { IPropsRemind } from '../../types'

const Index = (props: IPropsRemind) => {
	const { remind_time, useByDetail, onChangeRemind } = props
	const { t, i18n } = useTranslation()

	const options = useMemo(() => {
		const now = dayjs()

		return [
			{ label: t('translation:todo.Input.Remind.options.two_hour'), value: now.add(2, 'hour') },
			{ label: t('translation:todo.Input.Remind.options.half_day'), value: now.add(6, 'hour') },
			{ label: t('translation:todo.Input.Remind.options.day'), value: now.add(1, 'day') },
			{ label: t('translation:todo.Input.Remind.options.after_tomorrow'), value: now.add(2, 'day') },
			{ label: t('translation:todo.Input.Remind.options.three_day'), value: now.add(3, 'day') },
			{ label: t('translation:todo.Input.Remind.options.week'), value: now.add(1, 'week') },
			{ label: t('translation:todo.Input.Remind.options.half_month'), value: now.add(15, 'day') },
			{ label: t('translation:todo.Input.Remind.options.month'), value: now.add(1, 'month') },
			{ label: t('translation:todo.Input.Remind.options.half_year'), value: now.add(6, 'month') },
			{ label: t('translation:todo.Input.Remind.options.year'), value: now.add(1, 'year') }
		]
	}, [i18n.language])

	const Trigger = useMemo(
		() => (
			<div
				className={$cx(
					'btn_remind flex justify_center align_center clickable',
					remind_time && 'remind_time'
				)}
			>
				<Bell size={15}></Bell>
			</div>
		),
		[remind_time]
	)

	const onChange = useMemoizedFn((v: Dayjs) => {
		if (!v) return onChangeRemind(undefined)
		if (v.valueOf() <= dayjs().valueOf()) return

		onChangeRemind(v.valueOf())
	})

	return (
		<DatePicker
			className={$cx(styles._local, !useByDetail && styles.useByInput)}
			placeholder={t('translation:common.unset')}
			showTime
			size='small'
			suffixIcon={useByDetail ? false : Trigger}
			bordered={false}
			disabledDate={v => v && v <= dayjs().startOf('day')}
			getPopupContainer={() => document.body}
			presets={options}
			value={remind_time ? dayjs(remind_time) : undefined}
			onChange={onChange}
		></DatePicker>
	)
}

export default $app.memo(Index)
