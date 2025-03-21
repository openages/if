import { useMemoizedFn } from 'ahooks'
import { Progress } from 'antd'
import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { version } from '@/appdata'
import { useGlobal } from '@/context/app'
import { BoxArrowUp } from '@phosphor-icons/react'

import type { HasUpdate, Downloading } from '@/models/app'

const Index = () => {
	const global = useGlobal()
	const { t } = useTranslation()
	const app = global.app

	const checkUpdate = useMemoizedFn(() => app.checkUpdate())

	return (
		<Fragment>
			<span className='setting_title'>{t('setting.Update.title')}</span>
			<div className='setting_items screenlock_wrap w_100 border_box flex flex_column'>
				<div className='setting_item password_item w_100 border_box flex flex_column'>
					<div className='setting_content w_100 border_box flex justify_between align_center'>
						<div className='title_wrap flex align_center'>
							<BoxArrowUp size={24}></BoxArrowUp>
							<div className='text_wrap flex flex_column'>
								<span className='title'>{t('setting.Update.subtitle')}</span>
								<Choose>
									<When condition={app.update_status === null}>
										<span className='desc'>
											{t('setting.Update.desc')} : {version}
										</span>
									</When>
									<When condition={app.update_status?.type === 'has_update'}>
										<span className='desc'>
											{t('setting.Update.has_update')} :
											{(app.update_status as HasUpdate).version}
										</span>
									</When>
									<When condition={app.update_status?.type === 'downloading'}>
										<span className='desc'>
											{t('setting.Update.downloading')}
										</span>
									</When>
									<When condition={app.update_status?.type === 'downloaded'}>
										<span className='desc'>
											{t('setting.Update.downloaded')}
										</span>
									</When>
								</Choose>
							</div>
						</div>
						<div className='value_wrap flex align_center'>
							<Choose>
								<When condition={app.update_status === null}>
									<button
										className='btn flex justify_center align_center clickable'
										onClick={checkUpdate}
									>
										{t('setting.Update.btn_update')}
									</button>
								</When>
								<When condition={app.update_status?.type === 'has_update'}>
									<button
										className='btn flex justify_center align_center clickable'
										onClick={app.download}
									>
										{t('setting.Update.btn_download')}
									</button>
								</When>
								<When condition={app.update_status?.type === 'downloading'}>
									<Progress
										className='progress_circle'
										type='circle'
										strokeColor='var(--color_success)'
										size={36}
										percent={(app.update_status as Downloading).percent}
									></Progress>
								</When>
								<When condition={app.update_status?.type === 'downloaded'}>
									<button
										className='btn flex justify_center align_center clickable'
										onClick={app.install}
									>
										{t('setting.Update.btn_install')}
									</button>
								</When>
							</Choose>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
