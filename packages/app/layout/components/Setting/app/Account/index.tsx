import { useMemoizedFn } from 'ahooks'
import { Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useGlobal } from '@/context/app'
import { WifiHigh, WifiX } from '@phosphor-icons/react'

import { Sign, User } from './components'
import styles from './index.css'

import type { IPropsSign, IPropsUser } from './types'
import type { Trpc } from '@/types'

const Index = () => {
	const global = useGlobal()
	const { t } = useTranslation()
	const auth = global.auth

	const has_user_id = useMemo(() => Boolean(auth.user.id), [auth.user.id])

	const setSignIn = useMemoizedFn(() => (auth.sign_type = 'signin'))
	const setSignUp = useMemoizedFn(() => (auth.sign_type = 'signup'))

	const cancelEdit = useMemoizedFn(() => {
		auth.edit_mode = !auth.edit_mode
		auth.temp_user = {} as Trpc.UserData
	})

	const toggleEditMode = useMemoizedFn(() => {
		if (!auth.edit_mode) {
			cancelEdit()
		} else {
			auth.updateUser()
		}
	})

	const props_user: IPropsUser = {
		user: $copy(auth.user),
		temp_user: $copy(auth.temp_user),
		edit_mode: auth.edit_mode,
		updateTempUser: useMemoizedFn(
			(v: Partial<Trpc.UserData>) => (auth.temp_user = { ...auth.temp_user, ...v })
		),
		signout: useMemoizedFn(auth.signout),
		activate: useMemoizedFn(auth.activate)
	}

	const props_sign: IPropsSign = {
		sign_type: auth.sign_type,
		loading: $copy(auth.utils.loading),
		signin: useMemoizedFn(auth.signin),
		signup: useMemoizedFn(auth.signup),
		sendVerifyCode: useMemoizedFn(auth.sendVerifyCode)
	}

	return (
		<div className={$cx('w_100 h_100 flex flex_column', styles._local)}>
			<div className='header_wrap flex justify_between align_center'>
				<div className='setting_title flex align_center'>
					<span className='title mr_6'>{t('setting.nav.titles.Account')}</span>
					<Tooltip
						title={t('app.auth.test_title')}
						mouseEnterDelay={0.6}
						zIndex={9999}
						getTooltipContainer={() => document.body}
					>
						<div
							className={$cx(
								'btn_test flex justify_center align_center clickable',
								auth.test_status
							)}
							onClick={auth.test}
						>
							<Choose>
								<When condition={auth.test_status === 'error'}>
									<WifiX></WifiX>
								</When>
								<Otherwise>
									<WifiHigh></WifiHigh>
								</Otherwise>
							</Choose>
						</div>
					</Tooltip>
				</div>
				<Choose>
					<When condition={has_user_id}>
						<div className='action_type_wrap flex'>
							<If condition={auth.edit_mode}>
								<span className='action_type clickable active' onClick={cancelEdit}>
									{t('common.cancel')}
								</span>
								<span className='divider'>|</span>
							</If>
							<span className='action_type clickable active' onClick={toggleEditMode}>
								{auth.edit_mode ? t('common.save') : t('common.edit')}
							</span>
						</div>
					</When>
					<Otherwise>
						<div className='action_type_wrap flex'>
							<span
								className={$cx(
									'action_type clickable',
									auth.sign_type === 'signin' && 'active'
								)}
								onClick={setSignIn}
							>
								{t('app.auth.signin')}
							</span>
							<span className='divider'>|</span>
							<span
								className={$cx(
									'action_type clickable',
									auth.sign_type === 'signup' && 'active'
								)}
								onClick={setSignUp}
							>
								{t('app.auth.signup')}
							</span>
						</div>
					</Otherwise>
				</Choose>
			</div>
			<div className='sign_wrap flex justify_center align_center'>
				<Choose>
					<When condition={has_user_id}>
						<User {...props_user}></User>
					</When>
					<Otherwise>
						<Sign {...props_sign}></Sign>
					</Otherwise>
				</Choose>
			</div>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
