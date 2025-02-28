import { useMemoizedFn } from 'ahooks'
import { Form, Input, Switch, TimePicker } from 'antd'
import dayjs from 'dayjs'
import { pick } from 'lodash-es'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { deepEqual } from '@openages/stk/react'

import { IPropsSessionEditor } from '../../types'
import styles from './index.css'

import type { Dayjs } from 'dayjs'
import type { Pomo } from '@/types'

const { Item, useForm, useWatch } = Form

type FormValues = Omit<Pomo.Session, 'work_time' | 'break_time'> & {
	work_time: Dayjs
	break_time: Dayjs
}

const Index = (props: IPropsSessionEditor) => {
	const { item, onChange, close } = props
	const [form] = useForm()
	const { getFieldsValue, setFieldsValue } = form
	const flow_mode = useWatch('flow_mode', form)
	const { t } = useTranslation()

	useEffect(() => {
		if (flow_mode) {
			setFieldsValue({ work_time: dayjs().hour(0).minute(0), break_time: dayjs().hour(0).minute(0) })
		}
	}, [flow_mode])

	const getHandler = useMemoizedFn((v: IPropsSessionEditor['item']) => {
		const target = pick(v, ['title', 'flow_mode']) as unknown as FormValues
		const now = dayjs()

		const work_time = dayjs.duration({ minutes: v!.work_time })
		const break_time = dayjs.duration({ minutes: v!.break_time })

		target['work_time'] = now.hour(work_time.hours()).minute(work_time.minutes())
		target['break_time'] = now.hour(break_time.hours()).minute(break_time.minutes())

		return target
	})

	const setHandler = useMemoizedFn((v: FormValues) => {
		const target = (pick(v, ['title', 'flow_mode']) as unknown as IPropsSessionEditor['item'])!

		if (!target.title) target['title'] = ''

		if (!target['flow_mode']) {
			target['work_time'] = dayjs
				.duration({ hours: v.work_time.hour(), minutes: v.work_time.minute() })
				.asMinutes()

			target['break_time'] = dayjs
				.duration({ hours: v.break_time.hour(), minutes: v.break_time.minute() })
				.asMinutes()
		} else {
			target['work_time'] = 0
			target['break_time'] = 0
		}

		return target
	})

	useEffect(() => {
		if (!item) {
			return setFieldsValue({
				work_time: dayjs().hour(0).minute(45),
				break_time: dayjs().hour(0).minute(15)
			})
		}

		if (deepEqual(item, getFieldsValue())) return

		setFieldsValue(getHandler(item))
	}, [item])

	const onFinish = useMemoizedFn((v: FormValues) => {
		if ((!v['work_time'] || !v['break_time']) && !v['flow_mode'])
			return $message.warning(t('pomo.SessionEditor.warning'))

		onChange(setHandler(v))
		close?.()
	})

	return (
		<Form className={$cx('border_box', styles._local)} preserve={false} form={form} onFinish={onFinish}>
			<Item name='title' label={t('pomo.SessionEditor.target')}>
				<Input
					className='input'
					placeholder={t('pomo.SessionEditor.target_placeholder')}
					variant='borderless'
					maxLength={12}
				></Input>
			</Item>
			<Item name='work_time' label={t('pomo.SessionEditor.work_time')}>
				<TimePicker
					className='time_picker'
					format='HH:mm'
					variant='borderless'
					showNow={false}
					suffixIcon={null}
					disabled={flow_mode}
				></TimePicker>
			</Item>
			{!flow_mode && (
				<Item name='break_time' label={t('pomo.SessionEditor.break_time')}>
					<TimePicker
						className='time_picker'
						format='HH:mm'
						variant='borderless'
						showNow={false}
						suffixIcon={null}
					></TimePicker>
				</Item>
			)}
			<Item name='flow_mode' label={t('pomo.SessionEditor.flow_mode')}>
				<Switch className='switch' size='small'></Switch>
			</Item>
			<button className='btn_main w_100 clickable' type='submit'>
				{t('common.confirm')}
			</button>
		</Form>
	)
}

export default $app.memo(Index)
