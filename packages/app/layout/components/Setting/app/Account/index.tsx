import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'

import { useGlobal } from '@/context/app'

import { Sign } from './components'
import styles from './index.css'
import { IPropsSign } from './types'

const Index = () => {
	const { t } = useTranslation()
	const global = useGlobal()
	const auth = global.auth

	const setSignIn = useMemoizedFn(() => (auth.sign_type = 'signin'))
	const setSignUp = useMemoizedFn(() => (auth.sign_type = 'signup'))

	const props_sign: IPropsSign = {
		sign_type: auth.sign_type,
		signin: useMemoizedFn(auth.signin),
		signup: useMemoizedFn(auth.signup)
	}

	return (
		<div className={$cx('w_100 h_100 flex flex_column', styles._local)}>
			<div className='header_wrap flex justify_between align_center'>
				<span className='setting_title'>{t('translation:setting.nav.titles.Account')}</span>
				<div className='sign_type_wrap flex'>
					<span
						className={$cx('sign_type clickable', auth.sign_type === 'signin' && 'active')}
						onClick={setSignIn}
					>
						登录
					</span>
					<span className='divider'>|</span>
					<span
						className={$cx('sign_type clickable', auth.sign_type === 'signup' && 'active')}
						onClick={setSignUp}
					>
						注册
					</span>
				</div>
			</div>
			<div className='sign_wrap flex justify_center align_center'>
				<Sign {...props_sign}></Sign>
			</div>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
