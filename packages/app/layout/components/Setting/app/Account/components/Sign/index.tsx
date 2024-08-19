import { Button, Form, Input } from 'antd'

import { Lock, ShieldCheck, User } from '@phosphor-icons/react'

import styles from './index.css'

const { Item, useForm, useWatch } = Form
const { Password } = Input

const Index = () => {
	const [form] = useForm()
	const email = useWatch('email', form)
	const password = useWatch('password', form)
	const confirm_password = useWatch('confirm_password', form)
	const code = useWatch('code', form)

	return (
		<div className={$cx(' w_100 flex flex_column', styles._local)}>
			<h1 className='content_title text_center'>注册</h1>
			<Form className='form_wrap border_box flex flex_column' name='form_login' form={form}>
				<div className='input_wrap border_box'>
					<Item noStyle name='email'>
						<Input
							className={$cx('input input_email', email && 'has_value')}
							type='email'
							maxLength={30}
							prefix={<User size={21} />}
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
				<div className='input_wrap border_box'>
					<Item noStyle name='confirm_password'>
						<Password
							className={$cx(
								'input input_confirm_password',
								confirm_password && 'has_value'
							)}
							type='password'
							maxLength={24}
							prefix={<Lock size={21} />}
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
				<Button
					className={$cx('btn_login', !(email && password && code) && 'disabled')}
					type='primary'
					htmlType='submit'
					shape='round'
				>
					登录
				</Button>
			</Form>
		</div>
	)
}

export default $app.memo(Index)
