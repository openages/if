import { useMemoizedFn } from 'ahooks'
import { Button, Form, Input } from 'antd'
import { createPuzzle } from 'create-puzzle'
import SliderCaptcha from 'rc-slider-captcha'
import { useMemo, useRef, useState, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { genConfig } from 'react-nice-avatar'

import img_puzzle from '@/public/images/puzzle.png'
import { local } from '@openages/stk/storage'
import { EnvelopeSimple, Lock, LockKey, ShieldCheck } from '@phosphor-icons/react'

import BtnSend from '../BtnSend'
import styles from './index.css'

const { Item, useForm, useWatch } = Form
const { Password } = Input

import type { IPropsSign } from '../../types'
import type { InputRef } from 'antd'

const Index = (props: IPropsSign) => {
	const { sign_type, loading, signin, signup, sendVerifyCode } = props
	const [form] = useForm()
	const { t } = useTranslation()
	const email = useWatch('email', form)
	const password = useWatch('password', form)
	const confirm_password = useWatch('confirm_password', form)
	const code = useWatch('code', form)
	const ref_offset_x = useRef(0)
	const ref_email = useRef<InputRef>(null)
	const ref_password = useRef<InputRef>(null)
	const ref_confirm_password = useRef<InputRef>(null)
	const ref_code = useRef<InputRef>(null)
	const [verified, setVerified] = useState(false)
	const [focus_field, setFocusField] = useState('')

	const is_signin = sign_type === 'signin'
	const title = useMemo(() => (is_signin ? t('app.auth.signin') : t('app.auth.signup')), [is_signin])

	const sendVCode = useMemoizedFn(async () => {
		if (!email) {
			$message.warning(t('app.auth.email_not_input'))

			return false
		}

		await sendVerifyCode(email)
	})

	const request = useMemoizedFn(() =>
		createPuzzle(img_puzzle, { format: 'blob' }).then(res => {
			ref_offset_x.current = res.x

			return {
				bgUrl: res.bgUrl,
				puzzleUrl: res.puzzleUrl
			}
		})
	)

	const onVerify = useMemoizedFn(data => {
		if (data.x >= ref_offset_x.current - 3 && data.x < ref_offset_x.current + 3) {
			setVerified(true)

			return Promise.resolve()
		}

		setVerified(false)

		return Promise.reject()
	})

	const onBlur = useMemoizedFn(() => setFocusField(''))

	const onFinish = useMemoizedFn(async values => {
		const args = {
			mid: local.mid,
			email: values.email,
			password: values.password
		} as { password: string; email: string; mid: string; avatar?: string; code?: string }

		if (sign_type === 'signup') {
			args['code'] = values.code

			signup({
				...args,
				avatar: JSON.stringify(genConfig(values.email)),
				code: values.code
			})
		} else {
			signin(args)
		}
	})

	const password_ok = useMemo(() => password === confirm_password, [password, confirm_password])

	const btn_login_disabled = useMemo(() => {
		if (is_signin) return !(email && password && verified)

		return !(email && password && confirm_password && code && verified && password_ok)
	}, [is_signin, email, password, confirm_password, code, verified, password_ok])

	return (
		<div className={$cx(' w_100 flex flex_column', styles._local)}>
			<h1 className='content_title text_center'>{title}</h1>
			<Form
				className='form_wrap border_box flex flex_column'
				name='form_login'
				form={form}
				onFinish={onFinish}
			>
				<div
					className={$cx(
						'input_wrap email border_box',
						email && 'has_value',
						focus_field === 'email' && 'focused'
					)}
					data-placeholder={t('common.email')}
					onClick={() => ref_email.current?.focus()}
				>
					<Item noStyle name='email'>
						<Input
							className='input input_email'
							type='email'
							maxLength={30}
							prefix={<EnvelopeSimple size={21} />}
							autoComplete='off'
							ref={ref_email}
							onFocus={() => setFocusField('email')}
							onBlur={onBlur}
						></Input>
					</Item>
				</div>
				<div
					className={$cx(
						'input_wrap password border_box',
						password && 'has_value',
						focus_field === 'password' && 'focused'
					)}
					data-placeholder={t('common.password')}
					onClick={() => ref_password.current?.focus()}
				>
					<Item noStyle name='password'>
						<Password
							className='input input_password'
							type='password'
							maxLength={24}
							prefix={<Lock size={21} />}
							autoComplete='new-password'
							ref={ref_password}
							onFocus={() => setFocusField('password')}
							onBlur={onBlur}
						></Password>
					</Item>
				</div>
				{!is_signin && (
					<Fragment>
						<div
							className={$cx(
								'input_wrap confirm_password border_box',
								confirm_password && 'has_value',
								focus_field === 'confirm_password' && 'focused'
							)}
							data-placeholder={t('app.auth.confirm_password')}
							onClick={() => ref_confirm_password.current?.focus()}
						>
							<Item
								noStyle
								name='confirm_password'
								dependencies={['password']}
								rules={[
									{
										required: true
									},
									({ getFieldValue }) => ({
										validator(_, value) {
											if (!value || getFieldValue('password') === value) {
												return Promise.resolve()
											}

											return Promise.reject(
												new Error(t('app.auth.confirm_password_error'))
											)
										}
									})
								]}
							>
								<Password
									className='input input_confirm_password'
									type='password'
									maxLength={24}
									prefix={<LockKey size={21} />}
									autoComplete='new-password'
									ref={ref_confirm_password}
									onFocus={() => setFocusField('confirm_password')}
									onBlur={onBlur}
								></Password>
							</Item>
						</div>
						<div
							className={$cx(
								'input_wrap captcha_code border_box relative',
								code && 'has_value',
								focus_field === 'captcha_code' && 'focused'
							)}
							data-placeholder={t('common.captcha')}
							onClick={() => ref_code.current?.focus()}
						>
							<Item noStyle name='code'>
								<Input
									className='input input_captcha_code'
									type='text'
									maxLength={6}
									prefix={<ShieldCheck size={21} />}
									ref={ref_code}
									onFocus={() => setFocusField('captcha_code')}
									onBlur={onBlur}
								></Input>
							</Item>
							<BtnSend sendVCode={sendVCode} loading={loading['sendVerifyCode']}></BtnSend>
						</div>
					</Fragment>
				)}
				<SliderCaptcha
					mode='float'
					bgSize={{ width: 324, height: 172 }}
					loadingDelay={300}
					tipText={{
						default: t('app.auth.slider_captcha.default'),
						loading: t('app.auth.slider_captcha.loading'),
						verifying: t('app.auth.slider_captcha.verifying'),
						error: t('app.auth.slider_captcha.error')
					}}
					style={{
						'--rcsc-primary': 'var(--color_text)',
						'--rcsc-primary-light': 'rgba(var(--color_text_rgb),0.06)',
						'--rcsc-success': 'rgba(var(--color_success_rgb),0.81)',
						'--rcsc-success-light': 'rgba(var(--color_success_rgb),0.12)',
						'--rcsc-error': 'var(--color_danger)',
						'--rcsc-error-light': 'rgba(var(--color_danger_rgb),0.12)',
						'--rcsc-bg-color': 'var(--color_bg_1)',
						'--rcsc-text-color': 'var(--color_text)',
						'--rcsc-button-color': 'var(--color_text)',
						'--rcsc-button-bg-color': 'var(--color_bg_2)',
						'--rcsc-panel-border-radius': '6px',
						'--rcsc-control-border-radius': '6px',
						zIndex: 100
					}}
					request={request}
					onVerify={onVerify}
				/>
				<Button
					className={$cx('btn_login', btn_login_disabled && 'disabled')}
					type='primary'
					htmlType='submit'
					shape='round'
				>
					{title}
				</Button>
			</Form>
		</div>
	)
}

export default $app.memo(Index)
