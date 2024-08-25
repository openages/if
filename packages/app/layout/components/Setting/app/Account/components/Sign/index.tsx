import { useMemoizedFn } from 'ahooks'
import { Button, Form, Input } from 'antd'
import { createPuzzle } from 'create-puzzle'
import SliderCaptcha from 'rc-slider-captcha'
import { useMemo, useRef, useState, Fragment } from 'react'

import img_puzzle from '@/public/images/img_puzzle.png'
import { EnvelopeSimple, Lock, LockKey, ShieldCheck } from '@phosphor-icons/react'

import styles from './index.css'

const { Item, useForm, useWatch } = Form
const { Password } = Input

import type { IPropsSign } from '../../types'

const Index = (props: IPropsSign) => {
	const { sign_type, signin, signup, sendVerifyCode } = props
	const [form] = useForm()
	const email = useWatch('email', form)
	const password = useWatch('password', form)
	const confirm_password = useWatch('confirm_password', form)
	const code = useWatch('code', form)
	const ref_offset_x = useRef(0)
	const [verified, setVerified] = useState(false)

	const is_signin = sign_type === 'signin'
	const title = useMemo(() => (is_signin ? '登录' : '注册'), [is_signin])

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

	const btn_login_disabled = useMemo(() => {
		if (is_signin) return !(email && password && verified)

		return !(email && password && confirm_password && code && verified)
	}, [is_signin, email, password, confirm_password, code, verified])

	return (
		<div className={$cx(' w_100 flex flex_column', styles._local)}>
			<h1 className='content_title text_center'>{title}</h1>
			<Form className='form_wrap border_box flex flex_column' name='form_login' form={form}>
				<div className='input_wrap border_box'>
					<Item noStyle name='email'>
						<Input
							className={$cx('input input_email', email && 'has_value')}
							type='email'
							maxLength={30}
							prefix={<EnvelopeSimple size={21} />}
							autoComplete='off'
						></Input>
					</Item>
				</div>
				<div className='input_wrap border_box'>
					<Item noStyle name='password'>
						<Password
							className={$cx('input input_password', password && 'has_value')}
							type='password'
							maxLength={24}
							prefix={<Lock size={21} />}
							autoComplete='new-password'
						></Password>
					</Item>
				</div>
				{!is_signin && (
					<Fragment>
						<div className='input_wrap border_box'>
							<Item noStyle name='confirm_password'>
								<Password
									className={$cx(
										'input input_confirm_password',
										confirm_password && 'has_value'
									)}
									type='password'
									maxLength={24}
									prefix={<LockKey size={21} />}
									autoComplete='new-password'
								></Password>
							</Item>
						</div>
						<div className='input_wrap border_box relative'>
							<Item noStyle name='code'>
								<Input
									className={$cx('input input_captcha_code', code && 'has_value')}
									type='text'
									maxLength={6}
									prefix={<ShieldCheck size={21} />}
								></Input>
							</Item>
							<Button className='btn_send absolute cursor_point border_box clickable'>
								发送验证码
							</Button>
						</div>
					</Fragment>
				)}
				<SliderCaptcha
					mode='float'
					bgSize={{ width: 324, height: 172 }}
					loadingDelay={300}
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
					className={$cx('btn_login', !btn_login_disabled && 'disabled')}
					type='primary'
					htmlType='submit'
					shape='round'
					onClick={sendVerifyCode}
				>
					{title}
				</Button>
			</Form>
		</div>
	)
}

export default $app.memo(Index)
