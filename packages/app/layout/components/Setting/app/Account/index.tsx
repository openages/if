import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useGlobal } from '@/context/app'

import { Sign, User } from './components'
import styles from './index.css'

import type { IPropsSign, IPropsUser } from './types'
import type { Trpc } from '@/types'

const Index = () => {
	const { t } = useTranslation()
	const global = useGlobal()
	const auth = global.auth

	const has_user_id = useMemo(() => Boolean(auth.user.id), [auth.user.id])

	const setSignIn = useMemoizedFn(() => (auth.sign_type = 'signin'))
	const setSignUp = useMemoizedFn(() => (auth.sign_type = 'signup'))

	const toggleEditMode = useMemoizedFn(() => {
		if (!auth.edit_mode) {
			auth.edit_mode = !auth.edit_mode
			auth.temp_user = {} as Trpc.UserData
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
		signout: useMemoizedFn(auth.signout)
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
				<span className='setting_title'>{t('setting.nav.titles.Account')}</span>
				<Choose>
					<When condition={has_user_id}>
						<span className='btn_edit clickable' onClick={toggleEditMode}>
							{auth.edit_mode ? t('common.save') : t('common.edit')}
						</span>
					</When>
					<Otherwise>
						<div className='sign_type_wrap flex'>
							<span
								className={$cx(
									'sign_type clickable',
									auth.sign_type === 'signin' && 'active'
								)}
								onClick={setSignIn}
							>
								{t('app.auth.signin')}
							</span>
							<span className='divider'>|</span>
							<span
								className={$cx(
									'sign_type clickable',
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
