import { useMemoizedFn } from 'ahooks'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Avatar, { genConfig } from 'react-nice-avatar'

import styles from './index.css'

import type { IPropsUser } from '../../types'

const Index = (props: IPropsUser) => {
	const { user, temp_user, edit_mode, updateTempUser, signout } = props
	const { email, avatar } = user
	const { avatar: temp_avatar } = temp_user
	const { t } = useTranslation()

	const avatar_config = useMemo(() => JSON.parse(temp_avatar ?? avatar), [avatar, temp_avatar])

	const changeAvatar = useMemoizedFn(() => updateTempUser({ avatar: JSON.stringify(genConfig()) }))

	return (
		<div className={$cx('flex flex_column align_center', styles._local)}>
			<Avatar className='avatar' {...avatar_config}></Avatar>
			<If condition={edit_mode}>
				<button
					className='btn_change_avatar flex justify_center align_center clickable mt_16'
					onClick={changeAvatar}
				>
					{t('setting.Account.change_avatar')}
				</button>
			</If>
			<span className='email mt_12'>{email}</span>
			<button className='btn_signout flex justify_center align_center clickable mt_16' onClick={signout}>
				{t('app.auth.signout')}
			</button>
		</div>
	)
}

export default $app.memo(Index)
