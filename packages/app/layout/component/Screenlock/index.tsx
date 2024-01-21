import { useMemoizedFn } from 'ahooks'
import { Form, Input } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Else, If, Then } from 'react-if'

import { Logo, Show } from '@/components'
import { useGlobal } from '@/context/app'
import { ArrowRight, Copy, PlayCircle, Power, XCircle } from '@phosphor-icons/react'

import styles from './index.css'
import Time from './Time'

const { useForm, useWatch, Item } = Form
const { TextArea } = Input

const Index = () => {
	const global = useGlobal()
	const { t } = useTranslation()
	const [form] = useForm()
	const password = useWatch('password', form)
	const secret = useWatch('secret', form)
	const click_times = global.screenlock.click_times

	useEffect(() => {
		if (!click_times) return

		if (click_times === 12) {
			global.screenlock.unlocking()

			global.screenlock.click_times = 0

			return
		}

		const timer = setTimeout(() => {
			global.screenlock.click_times = 0
		}, 1200)

		return () => clearTimeout(timer)
	}, [click_times])

	const togglePasswordMode = useMemoizedFn((v?: boolean | any) => {
		global.screenlock.verified = true
		global.screenlock.password_mode = typeof v === 'boolean' ? v : !global.screenlock.password_mode
	})

	const reset = useMemoizedFn(() => {
		global.screenlock.input_password = ''
		global.screenlock.input_private_key = ''
		global.screenlock.password_mode = true
	})

	const btn_active = useMemo(() => {
		if (global.screenlock.data.unlocking) return secret?.length > 0

		return global.screenlock.password_mode ? password?.length >= 6 : secret?.length > 0
	}, [global.screenlock.password_mode, global.screenlock.data.unlocking, password, secret])

	const onFinish = useMemoizedFn(async () => {
		if (!btn_active) return

		if (!global.screenlock.data.unlocking) {
			const value = global.screenlock.password_mode ? password : secret

			const ok = await global.screenlock.verify(value, global.screenlock.password_mode, true)

			global.screenlock.verified = ok

			if (!ok) return

			reset()
		} else {
			global.screenlock.unlock(secret)
		}
	})

	const onValuesChange = useMemoizedFn(() => (global.screenlock.verified = true))

	const clickTimes = useMemoizedFn(() => global.screenlock.click_times++)

	const copy = useMemoizedFn(async () => {
		await navigator.clipboard.writeText(global.screenlock.data.private_key)

		alert(t('translation:app.screenlock.copied'))
	})

	const Content = (
		<Show
			className={$cx(styles._local, 'w_100vw h_100vh fixed z_index_1000 flex justify_center align_center')}
			visible={global.screenlock.screenlock_open}
		>
			<div className='bg_wrap w_100 absolute left_0'></div>
			<div className='blur_wrap w_100 h_100 absolute top_0 left_0 flex flex_column align_center justify_center'></div>
			<div className='logo absolute' onClick={clickTimes}>
				<Logo color='white' size={24}></Logo>
			</div>
			<Time></Time>
			<Form
				className='content_wrap absolute flex flex_column align_center justify_center'
				form={form}
				onFinish={onFinish}
				onValuesChange={onValuesChange}
			>
				<If condition={global.screenlock.data.unlocking}>
					<Then>
						<div className='input_wrap secret w_100 flex flex_column relative'>
							<div
								className='btn_copy flex justify_center align_center absolute clickable'
								onClick={copy}
							>
								<Copy></Copy>
							</div>
							<textarea
								className='input lock_input w_100 border_box mb_12'
								disabled
								value={global.screenlock.data.private_key}
							/>
							<div className='text_normal lock_text w_100 border_box text_center mb_12 flex flex_column align_center'>
								<span>
									发送上方请求码到下方邮箱，一至三个工作日内解锁码将发送到您的邮箱
								</span>
								<span>openages@gmail.com</span>
							</div>
							<Item name='secret' noStyle>
								<TextArea
									className={$cx(
										'input w_100 border_box',
										!global.screenlock.verified && 'unverified'
									)}
									placeholder='输入解锁码'
								/>
							</Item>
							<button
								className='btn_confirm clickable'
								type='submit'
								disabled={!btn_active}
							>
								确认
							</button>
							<span className='w_100 text_center mt_12 text_normal'>已处于锁定模式</span>
						</div>
					</Then>
					<Else>
						{global.screenlock.password_mode ? (
							<div className='input_wrap password relative'>
								<Item name='password' noStyle>
									<Input
										className={$cx(
											'input w_100 border_box',
											!global.screenlock.verified && 'unverified'
										)}
										maxLength={18}
										placeholder='输入密码'
										type='password'
									/>
								</Item>
								<button
									className='btn_confirm password border_box absolute flex justify_center align_center clickable'
									type='submit'
									disabled={!btn_active}
								>
									<ArrowRight weight='bold'></ArrowRight>
								</button>
							</div>
						) : (
							<div className='input_wrap secret w_100 flex flex_column'>
								<Item name='secret' noStyle>
									<TextArea
										className={$cx(
											'input w_100 border_box',
											!global.screenlock.verified && 'unverified'
										)}
										placeholder='输入密钥'
									/>
								</Item>
								<button
									className='btn_confirm clickable'
									type='submit'
									disabled={!btn_active}
								>
									确认
								</button>
							</div>
						)}
						<span className='text_normal mt_12 clickable' onClick={togglePasswordMode}>
							{global.screenlock.password_mode ? '忘记密码' : '使用密码'}
						</span>
					</Else>
				</If>
			</Form>
			<div className='actions_wrap flex align_center absolute'>
				<div className='action_item flex flex_column align_center'>
					<span className='text'>退出</span>
					<div className='icon_wrap flex justify_center align_center clickable'>
						<Power size={16} weight='light'></Power>
					</div>
				</div>
				<div className='action_item flex flex_column align_center'>
					<span className='text'>重启</span>
					<div className='icon_wrap flex justify_center align_center clickable'>
						<PlayCircle size={16} weight='light'></PlayCircle>
					</div>
				</div>
				<div className='action_item flex flex_column align_center'>
					<span className='text'>最小化</span>
					<div className='icon_wrap flex justify_center align_center clickable'>
						<XCircle size={16} weight='light'></XCircle>
					</div>
				</div>
			</div>
		</Show>
	)

	return createPortal(Content, document.body)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
