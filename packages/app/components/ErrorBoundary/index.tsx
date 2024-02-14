import { useMemoizedFn } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { useRouteError } from 'react-router'

import { clearStorage } from '@/actions/global'

import styles from './index.css'

const Index = () => {
	const error = useRouteError()
	const { t } = useTranslation()

	const reload = useMemoizedFn(() => window.location.reload())

	return (
		<div className={$cx('fixed top_0 left_0 w_100vw h_100vh flex justify_center align_center', styles._local)}>
			<div className='error_wrap flex flex_column align_center'>
				<img className='img' src='/illustrations/sorry.svg' alt='sorry' />
				<span className='title'>{t('translation:app.ErrorBoundary.title')}</span>
				<span className='desc'>{t('translation:app.ErrorBoundary.desc')}</span>
				<div className='actions_wrap'>
					<button className='btn clickable mr_12' onClick={reload}>
						{t('translation:common.reload')}
					</button>
					<button className='btn clickable' onClick={clearStorage}>
						{t('translation:common.clear_storage')}
					</button>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
