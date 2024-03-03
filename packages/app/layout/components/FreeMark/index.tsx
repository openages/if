import { useTranslation } from 'react-i18next'

import styles from './index.css'

import type { IPropsFreeMark } from '../../types'

const Index = (props: IPropsFreeMark) => {
	const { user_type } = props
	const { t } = useTranslation()

	if (user_type !== 'free') return null

	return (
		<div
			className={$cx('fixed flex flex_column cursor_point', styles._local)}
			style={{ zIndex: `calc(infinity + 1)` }}
		>
			<span className={styles.title}>{t('translation:app.free_mark.title')}</span>
			<span className={styles.desc}>{t('translation:app.free_mark.desc')}</span>
		</div>
	)
}

export default $app.memo(Index)
