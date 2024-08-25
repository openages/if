import { useMemoizedFn } from 'ahooks'
import { useTranslation } from 'react-i18next'

import { clearStorage } from '@/actions/global'

import styles from './index.css'

const Index = () => {
	const { t } = useTranslation()

	const reload = useMemoizedFn(() => window.location.reload())

	return (
		<div className={$cx('fixed top_0 left_0 w_100vw h_100vh flex justify_center align_center', styles._local)}>
			<div className='error_wrap flex flex_column align_center'>
				<img className='img' src='/illustrations/sorry.svg' alt='sorry' />
				<span className='title'>{t('app.ErrorBoundary.title')}</span>
				<span className='desc'>{t('app.ErrorBoundary.desc')}</span>
				<div className='actions_wrap'>
					<button className='btn clickable mr_12' onClick={reload}>
						{t('common.reload')}
					</button>
					<button className='btn clickable' onClick={clearStorage}>
						{t('common.clear_storage')}
					</button>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
