import { useMemoizedFn } from 'ahooks'
import { Form, Input, Switch, TimePicker } from 'antd'
import dayjs from 'dayjs'
import { pick } from 'lodash-es'
import { useEffect } from 'react'

import { deepEqual } from '@openages/stk/react'

import { IPropsSessionEditor } from '../../types'
import styles from './index.css'

import type { Dayjs } from 'dayjs'

const { useForm, Item } = Form

type FormValues = Omit<IPropsSessionEditor['item'], 'work_time' | 'break_time'> & {
	work_time: Dayjs
	break_time: Dayjs
}

const Index = (props: IPropsSessionEditor) => {
	const { item, onChange, close } = props
	const [form] = useForm()
	const { getFieldsValue, setFieldsValue } = form

	const getHandler = useMemoizedFn((v: IPropsSessionEditor['item']) => {
		const target = pick(v, ['title', 'flow_mode']) as FormValues
		const now = dayjs()

		const work_time = dayjs.duration({ minutes: v.work_time })
		const break_time = dayjs.duration({ minutes: v.break_time })

		target['work_time'] = now.hour(work_time.hours()).minute(work_time.minutes())
		target['break_time'] = now.hour(break_time.hours()).minute(break_time.minutes())

		return target
	})

	const setHandler = useMemoizedFn((v: FormValues) => {
		const target = pick(v, ['title', 'flow_mode']) as IPropsSessionEditor['item']

		if (!target.title) target['title'] = ''

		target['work_time'] = dayjs
			.duration({ hours: v.work_time.hour(), minutes: v.work_time.minute() })
			.asMinutes()

		target['break_time'] = dayjs
			.duration({ hours: v.break_time.hour(), minutes: v.break_time.minute() })
			.asMinutes()

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
		if (!v['work_time'] || !v['break_time']) return $message.warning('请添加时长')

		onChange(setHandler(v))
		close?.()
	})

	return (
		<Form className={$cx('border_box', styles._local)} form={form} onFinish={onFinish}>
			<Item name='title' label='目标'>
				<Input className='input' placeholder='输入目标' variant='borderless' maxLength={12}></Input>
			</Item>
			<Item name='work_time' label='工作时间'>
				<TimePicker
					className='time_picker'
					format='HH:mm'
					variant='borderless'
					showNow={false}
					suffixIcon={null}
				></TimePicker>
			</Item>
			<Item name='break_time' label='休息时间'>
				<TimePicker
					className='time_picker'
					format='HH:mm'
					variant='borderless'
					showNow={false}
					suffixIcon={null}
				></TimePicker>
			</Item>
			<Item name='flow_mode' label='心流模式'>
				<Switch className='switch' size='small'></Switch>
			</Item>
			<button className='btn_main w_100 clickable' type='submit'>
				确认
			</button>
		</Form>
	)
}

export default $app.memo(Index)
