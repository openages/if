import { useMemoizedFn, useReactive, useToggle } from 'ahooks'
import { Button, Input, Modal, Select } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { useMemo, useState, Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { autolock_map } from '@/appdata'
import { useGlobal } from '@/context/app'
import { Copy, Lock, ShieldStar } from '@phosphor-icons/react'

import styles from '../index.css'

import type { ChangeEvent } from 'react'
import type { App } from '@/types'

const { Password, TextArea } = Input

const Index = () => {
	const global = useGlobal()
	const { t } = useTranslation()
	const [password, setPassword] = useState('')
	const [private_key, setPrivateKey] = useState('')
	const [verified, setVerified] = useState(false)
	const [loading, setLoading] = useState(false)
	const [visible, { toggle: toggleInput, setLeft: setVisibleFalse }] = useToggle(false)
	const [use_password, { toggle: toggleUse, setLeft: setUsePasswordTrue }] = useToggle(true)
	const keypair = useReactive<Omit<App.Screenlock, 'autolock'>>({ private_key: '', public_key: '', password: '' })

	const set_mode = useMemo(() => global.app.screenlock.public_key !== '', [global.app.screenlock.public_key])
	const title = useMemo(() => (set_mode ? '修改' : '设置') + '密码', [set_mode])

	const onChangePassword = useMemoizedFn((e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value))
	const onChangePrivateKey = useMemoizedFn((e: ChangeEvent<HTMLTextAreaElement>) => setPrivateKey(e.target.value))

	const genKeyPair = useMemoizedFn(async () => {
		const { private_key, public_key, password: pwd } = await global.app.genKeyPair(password)

		keypair.private_key = private_key
		keypair.public_key = public_key
		keypair.password = pwd
	})

	const copy = useMemoizedFn(async () => {
		await navigator.clipboard.writeText(keypair.private_key)

		$message.success('密钥已复制到粘贴板')
	})

	const verify = useMemoizedFn(async () => {
		setLoading(true)

		const value = use_password ? password : private_key

		const ok = await global.app.verify(value, use_password)

		setVerified(ok)
		setLoading(false)
	})

	const onOk = useMemoizedFn(async () => {
		await global.app.saveKeyPair($copy(keypair))

		setVisibleFalse()
	})

	const reset = useMemoizedFn(() => {
		setPassword('')
		setPrivateKey('')
		setVerified(false)
		setUsePasswordTrue()

		keypair.private_key = ''
		keypair.public_key = ''
		keypair.password = ''
	})

	return (
		<Fragment>
			<span className='setting_title'>{t('translation:setting.Screenlock.title')}</span>
			<div className='setting_items screenlock_wrap w_100 border_box flex flex_column'>
				<div className='setting_item password_item w_100 border_box flex flex_column'>
					<div className='setting_content w_100 border_box flex justify_between align_center'>
						<div className='title_wrap flex align_center'>
							<ShieldStar size={24}></ShieldStar>
							<div className='text_wrap flex flex_column'>
								<span className='title'>
									{t('translation:setting.Screenlock.password.title')}
								</span>
								<span className='desc'>
									{t('translation:setting.Screenlock.password.desc')}
								</span>
							</div>
						</div>
						<div className='value_wrap flex align_center'>
							<button
								className='btn flex justify_center align_center clickable'
								onClick={toggleInput}
							>
								{title}
							</button>
						</div>
					</div>
				</div>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<div className='title_wrap flex align_center'>
						<Lock size={24}></Lock>
						<div className='text_wrap flex flex_column'>
							<span className='title'>
								{t('translation:setting.Screenlock.autolock.title')}
							</span>
							<span className='desc'>
								{t('translation:setting.Screenlock.autolock.desc')}
							</span>
						</div>
					</div>
					<div className='value_wrap flex align_center'>
						<Select
							className='select'
							// value={global.locale.lang}
							// options={locale_options}
							// onSelect={v => {
							// 	global.locale.setLang(v)

							// 	changeLanguage(v)
							// }}
						></Select>
					</div>
				</div>
			</div>
			<Modal
				className={$cx(styles.password_modal, !keypair.private_key && styles.ungenerated)}
				open={visible}
				title={title}
				width={300}
				centered
				destroyOnClose
				onCancel={setVisibleFalse}
				onOk={onOk}
				afterClose={reset}
			>
				{use_password && (
					<Password
						className='password_input'
						placeholder='输入锁屏密码'
						maxLength={18}
						autoFocus
						value={password}
						onChange={onChangePassword}
					></Password>
				)}
				{!set_mode && (
					<Button
						className='w_100 mt_12'
						type='primary'
						disabled={password.length < 6}
						onClick={genKeyPair}
					>
						生成密钥
					</Button>
				)}
				<AnimatePresence>
					{(keypair.private_key || !use_password) && (
						<motion.div
							className={$cx('key_wrap w_100 border_box', set_mode && 'set_mode')}
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.18 }}
						>
							<div className='padding_wrap w_100 border_box flex flex_column align_center relative'>
								<div
									className='btn_copy flex justify_center align_center absolute clickable'
									onClick={copy}
								>
									<Copy></Copy>
								</div>
								<TextArea
									className='password_key'
									placeholder='请输入保存的密钥'
									value={
										!set_mode && use_password
											? keypair.private_key
											: private_key
									}
									readOnly={use_password}
									onChange={set_mode && !use_password && onChangePrivateKey}
								></TextArea>
								{!set_mode && (
									<span className='desc text_center'>
										密钥可用来修改密码和重置密码，请务必妥善保存
									</span>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
				{set_mode && (
					<Fragment>
						<Button className='btn_toggle_use w_100 mt_12' type='text' onClick={toggleUse}>
							使用{use_password ? '密钥' : '密码'}修改
						</Button>
						<Button
							className='w_100 mt_12'
							type='primary'
							disabled={use_password ? password.length < 6 : !private_key.length}
							loading={loading}
							onClick={verify}
						>
							验证
						</Button>
					</Fragment>
				)}
			</Modal>
		</Fragment>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
