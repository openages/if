import { useMemoizedFn, useReactive, useToggle } from 'ahooks'
import { Button, Input, Modal, Select } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { useMemo, useState, Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { useGlobal } from '@/context/app'
import { Copy, Lock, ShieldStar } from '@phosphor-icons/react'

import styles from '../index.css'

import type { ChangeEvent } from 'react'
import type { App } from '@/types'

const { Password, TextArea } = Input

const Index = () => {
	const global = useGlobal()
	const { t } = useTranslation()
	const [input_password, setInputPassword] = useState('')
	const [input_private_key, setInputPrivateKey] = useState('')
	const [loading, setLoading] = useState(false)
	const [verified, seVerified] = useState(true)
	const [visible, { toggle: toggleInput, setLeft: setVisibleFalse }] = useToggle(false)
	const [use_password, { toggle: toggleUse, setLeft: setUsePasswordTrue }] = useToggle(true)
	const keypair = useReactive<Omit<App.Screenlock, 'autolock'>>({ private_key: '', public_key: '', password: '' })

	const reset_mode = useMemo(() => global.app.screenlock.public_key !== '', [global.app.screenlock.public_key])
	const title = useMemo(() => (reset_mode ? '重置' : '设置') + '密码', [reset_mode])

	const onChangePassword = useMemoizedFn((e: ChangeEvent<HTMLInputElement>) => {
		if (!verified) seVerified(true)

		setInputPassword(e.target.value)
	})
	const onChangePrivateKey = useMemoizedFn((e: ChangeEvent<HTMLTextAreaElement>) => {
		if (!verified) seVerified(true)

		setInputPrivateKey(e.target.value)
	})

	const genKeyPair = useMemoizedFn(async () => {
		const { private_key, public_key, password: pwd } = await global.app.genKeyPair(input_password)

		keypair.private_key = private_key
		keypair.public_key = public_key
		keypair.password = pwd
	})

	const copy = useMemoizedFn(async () => {
		await navigator.clipboard.writeText(keypair.private_key)

		$message.success('密钥已复制到粘贴板')
	})

	const reset = useMemoizedFn(() => {
		setInputPassword('')
		setInputPrivateKey('')
		setUsePasswordTrue()

		keypair.private_key = ''
		keypair.public_key = ''
		keypair.password = ''
	})

	const onOk = useMemoizedFn(async () => {
		if (!reset_mode) {
			setVisibleFalse()

			await global.app.saveKeyPair($copy(keypair))
		} else {
			setLoading(true)

			const value = use_password ? input_password : input_private_key

			const ok = await global.app.verify(value, use_password)

			setLoading(false)
			seVerified(ok)

			if (!ok) return

			await global.app.resetPassword()

			reset()
		}
	})

	const ungenerated = useMemo(() => {
		if (reset_mode) return use_password ? input_password.length < 6 : !input_private_key.length

		return input_password.length < 6 || !keypair.private_key.length
	}, [reset_mode, use_password, keypair.private_key, input_password, input_private_key])

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
				className={$cx(styles.password_modal, ungenerated && styles.ungenerated)}
				{...(reset_mode ? { okText: '重置密码' } : {})}
				open={visible}
				title={title}
				width={300}
				confirmLoading={loading}
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
						status={!verified && 'error'}
						value={input_password}
						onChange={onChangePassword}
					></Password>
				)}
				{!reset_mode && (
					<Button
						className='w_100 mt_12'
						type='primary'
						disabled={input_password.length < 6}
						onClick={genKeyPair}
					>
						生成密钥
					</Button>
				)}
				<AnimatePresence>
					{(keypair.private_key || !use_password) && (
						<motion.div
							className={$cx('key_wrap w_100 border_box', reset_mode && 'reset_mode')}
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
									autoFocus={reset_mode}
									readOnly={use_password}
									status={!verified && 'error'}
									value={
										!reset_mode && use_password
											? keypair.private_key
											: input_private_key
									}
									onChange={reset_mode && !use_password && onChangePrivateKey}
								></TextArea>
								{!reset_mode && (
									<span className='desc text_center'>
										密钥可用来重置密码，请务必妥善保存
									</span>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
				{reset_mode && (
					<Button className='btn_toggle_use w_100 mt_12' type='text' onClick={toggleUse}>
						使用{use_password ? '密钥' : '密码'}重置
					</Button>
				)}
			</Modal>
		</Fragment>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
