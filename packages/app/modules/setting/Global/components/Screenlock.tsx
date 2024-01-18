import { useMemoizedFn } from 'ahooks'
import { Button, Input, Modal, Select } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { useMemo, Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { autolock_options } from '@/appdata'
import { useGlobal } from '@/context/app'
import { Copy, Lock, ShieldStar } from '@phosphor-icons/react'

import styles from '../index.css'

import type { ChangeEvent } from 'react'

const { Password, TextArea } = Input

const Index = () => {
	const global = useGlobal()
	const { t } = useTranslation()

	const reset_mode = useMemo(() => global.screenlock.data.public_key !== '', [global.screenlock.data.public_key])
	const title = useMemo(() => t(`translation:app.screenlock.${reset_mode ? 're' : ''}set_password`), [reset_mode])

	const toggleModalOpen = useMemoizedFn(
		(v?: boolean | any) =>
			(global.screenlock.modal_open = typeof v === 'boolean' ? v : !global.screenlock.modal_open)
	)
	const togglePasswordMode = useMemoizedFn(
		(v?: boolean | any) =>
			(global.screenlock.password_mode = typeof v === 'boolean' ? v : !global.screenlock.password_mode)
	)

	const onChangePassword = useMemoizedFn((e: ChangeEvent<HTMLInputElement>) => {
		if (!global.screenlock.verified) global.screenlock.verified = true

		global.screenlock.input_password = e.target.value
	})
	const onChangePrivateKey = useMemoizedFn((e: ChangeEvent<HTMLTextAreaElement>) => {
		if (!global.screenlock.verified) global.screenlock.verified = true

		global.screenlock.input_private_key = e.target.value
	})

	const genKeyPair = useMemoizedFn(async () => {
		await global.screenlock.genKeyPair(global.screenlock.input_password)
	})

	const copy = useMemoizedFn(async () => {
		await navigator.clipboard.writeText(global.screenlock.keypair.private_key)

		$message.success(t('translation:app.screenlock.copied'))
	})

	const reset = useMemoizedFn(() => {
		global.screenlock.input_password = ''
		global.screenlock.input_private_key = ''
		global.screenlock.password_mode = true
		global.screenlock.keypair = { private_key: '', public_key: '', password: '' }
	})

	const onOk = useMemoizedFn(async () => {
		if (!reset_mode) {
			toggleModalOpen(false)

			await global.screenlock.saveKeyPair($copy(global.screenlock.keypair))
		} else {
			global.screenlock.loading = true

			const value = global.screenlock.password_mode
				? global.screenlock.input_password
				: global.screenlock.input_private_key

			const ok = await global.screenlock.verify(value, global.screenlock.password_mode)

			global.screenlock.loading = false
			global.screenlock.verified = ok

			if (!ok) return

			await global.screenlock.resetPassword()

			reset()
		}
	})

	const setAutoLock = useMemoizedFn(v => global.screenlock.setAutoLock(v))

	const ungenerated = useMemo(() => {
		if (reset_mode)
			return global.screenlock.password_mode
				? global.screenlock.input_password.length < 6
				: !global.screenlock.input_private_key.length

		return global.screenlock.input_password.length < 6 || !global.screenlock.keypair.private_key.length
	}, [
		reset_mode,
		global.screenlock.password_mode,
		global.screenlock.keypair.private_key,
		global.screenlock.input_password,
		global.screenlock.input_private_key
	])

	const ModalContent = (
		<Fragment>
			{global.screenlock.password_mode && (
				<Password
					className={$cx('password_input', !global.screenlock.verified && 'unverified')}
					placeholder={t('translation:app.screenlock.password_placeholder')}
					maxLength={18}
					autoFocus
					status={!global.screenlock.verified && 'error'}
					value={global.screenlock.input_password}
					onChange={onChangePassword}
				></Password>
			)}
			{!reset_mode && (
				<Button
					className='w_100 mt_12'
					type='primary'
					disabled={global.screenlock.input_password.length < 6}
					onClick={genKeyPair}
				>
					{t('translation:app.screenlock.generate_secret_key')}
				</Button>
			)}
			<AnimatePresence>
				{(global.screenlock.keypair.private_key || !global.screenlock.password_mode) && (
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
								className={$cx(
									'password_key',
									!global.screenlock.verified && 'unverified'
								)}
								placeholder={t('translation:app.screenlock.secret_key_placeholder')}
								autoFocus={reset_mode}
								readOnly={global.screenlock.password_mode}
								status={!global.screenlock.verified && 'error'}
								value={
									!reset_mode && global.screenlock.password_mode
										? global.screenlock.keypair.private_key
										: global.screenlock.input_private_key
								}
								onChange={
									reset_mode &&
									!global.screenlock.password_mode &&
									onChangePrivateKey
								}
							></TextArea>
							{!reset_mode && (
								<span className='desc text_center'>
									{t('translation:app.screenlock.desc')}
								</span>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			{reset_mode && (
				<Button className='btn_toggle_use w_100 mt_12' type='text' onClick={togglePasswordMode}>
					{/* @ts-ignore */}
					{t('translation:app.screenlock.use_x_reset', {
						mode: global.screenlock.password_mode
							? t('translation:common.secret_key')
							: t('translation:common.password')
					})}
				</Button>
			)}
		</Fragment>
	)

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
								onClick={toggleModalOpen}
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
							value={global.screenlock.data.autolock}
							options={autolock_options}
							onSelect={setAutoLock}
						></Select>
					</div>
				</div>
			</div>
			<Modal
				className={$cx(styles.password_modal, ungenerated && styles.ungenerated)}
				{...(reset_mode ? { okText: t('translation:app.screenlock.reset_password') } : {})}
				open={global.screenlock.modal_open}
				title={title}
				width={300}
				confirmLoading={global.screenlock.loading}
				centered
				destroyOnClose
				onCancel={toggleModalOpen}
				onOk={onOk}
				afterClose={reset}
			>
				{ModalContent}
			</Modal>
		</Fragment>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
