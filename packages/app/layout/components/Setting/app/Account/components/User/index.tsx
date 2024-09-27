import { useMemoizedFn, useToggle } from 'ahooks'
import { Button, Input } from 'antd'
import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Avatar, { genConfig } from 'react-nice-avatar'

import { PressButton, ShowUseHeight } from '@/components'
import { confirm } from '@/utils/antd'
import { AndroidLogo, ArrowsClockwise, CaretDoubleUp, Power, UserCircleMinus } from '@phosphor-icons/react'

import styles from './index.css'

import type { ChangeEvent } from 'react'
import type { IPropsUser } from '../../types'
import type { InputRef } from 'antd'
import type { NiceAvatarProps } from 'react-nice-avatar'

const Index = (props: IPropsUser) => {
	const { user, temp_user, edit_mode, updateTempUser, signout, activate, shutdown } = props
	const { id, name, email, avatar } = user
	const { name: temp_name, avatar: temp_avatar } = temp_user
	const { t } = useTranslation()
	const [visible_activate, { toggle: toggleActivate }] = useToggle(false)
	const ref_input_activate = useRef<InputRef>(null)

	const avatar_config = useMemo(() => JSON.parse(temp_avatar ?? avatar), [avatar, temp_avatar])

	const changeName = useMemoizedFn((e: ChangeEvent<HTMLInputElement>) => updateTempUser({ name: e.target.value }))
	const changeAvatar = useMemoizedFn(() => updateTempUser({ avatar: JSON.stringify(genConfig()) }))

	const copyPassport = useMemoizedFn(async () => {
		await window.navigator.clipboard.writeText(id)

		$message.success(t('app.auth.passport') + t('common.letter_space') + t('common.copied'))
	})

	const onActivate = useMemoizedFn(() => {
		activate(ref_input_activate.current?.input?.value!)
		toggleActivate()
	})

	const onShutdown = useMemoizedFn(async () => {
		const { destroy } = $modal.confirm({
			title: t('app.auth.shutdown.confirm.title'),
			content: t('app.auth.shutdown.confirm.content'),
			zIndex: 9999,
			centered: true,
			footer(_, actions) {
				const { CancelBtn } = actions

				return (
					<div className={$cx('w_100 flex flex_column', styles.shutdown_footer)}>
						<PressButton
							className='w_100 mb_12'
							time={6}
							trigger={() => {
								destroy()
								shutdown()
							}}
						>
							<Button className='btn_confirm' danger>
								{t('common.press') + t('common.letter_space') + t('common.confirm')}
							</Button>
						</PressButton>
						<CancelBtn></CancelBtn>
					</div>
				)
			}
		})
	})

	return (
		<div className={$cx('w_100 h_100 flex flex_column align_center justify_center relative', styles._local)}>
			<div className={$cx('avatar_wrap relative flex justify_center mb_12', edit_mode && 'edit_mode')}>
				<Avatar className='avatar' {...(avatar_config as NiceAvatarProps)}></Avatar>
				<If condition={edit_mode}>
					<button
						className='btn_change_avatar flex justify_center align_center clickable absolute'
						onClick={changeAvatar}
					>
						<ArrowsClockwise size={12}></ArrowsClockwise>
					</button>
				</If>
			</div>
			<Choose>
				<When condition={edit_mode}>
					<Input className='input_name' value={temp_name ?? name} onChange={changeName}></Input>
				</When>
				<Otherwise>
					<span className='name'>{temp_name ?? name}</span>
				</Otherwise>
			</Choose>
			<span className='email'>{email}</span>
			<If condition={!edit_mode}>
				<div className='actions_wrap w_100 flex flex_column align_center absolute'>
					<ShowUseHeight visible={visible_activate}>
						<div className='activate_wrap flex flex_column'>
							<Input
								className='input_activate'
								ref={ref_input_activate}
								placeholder={t('app.auth.activate_code')}
								maxLength={12}
							></Input>
							<Button
								className='btn_activate clickable'
								type='primary'
								onClick={onActivate}
							>
								{t('common.confirm')}
							</Button>
						</div>
					</ShowUseHeight>
					<div className='action_items flex w_100 flex justify_center align_center'>
						<div
							className='action_item flex flex_column align_center justify_center clickable'
							onClick={signout}
						>
							<Power className='icon'></Power>
							<span className='text'>{t('app.auth.signout')}</span>
						</div>
						<div
							className='action_item flex flex_column align_center justify_center clickable'
							onClick={copyPassport}
						>
							<AndroidLogo className='icon'></AndroidLogo>
							<span className='text'>{t('app.auth.passport')}</span>
						</div>
						{/* <div
							className={$cx(
								'action_item flex flex_column align_center justify_center clickable',
								visible_activate && 'active'
							)}
							onClick={toggle}
						>
							<CaretDoubleUp className='icon'></CaretDoubleUp>
							<span className='text'>{t('app.auth.activate')}</span>
						</div> */}
						<div
							className='action_item flex flex_column align_center justify_center clickable'
							onClick={onShutdown}
						>
							<UserCircleMinus className='icon'></UserCircleMinus>
							<span className='text'>{t('app.auth.shutdown.title')}</span>
						</div>
					</div>
				</div>
			</If>
		</div>
	)
}

export default $app.memo(Index)
