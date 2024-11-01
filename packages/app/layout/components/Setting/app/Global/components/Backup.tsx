import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { useGlobal } from '@/context/app'
import { ArrowFatLinesDown, ArrowFatLinesUp } from '@phosphor-icons/react'

const Index = () => {
	const global = useGlobal()
	const { t } = useTranslation()

	return (
		<Fragment>
			<span className='setting_title'>{t('setting.Backup.title')}</span>
			<div className='setting_items screenlock_wrap w_100 border_box flex flex_column'>
				<div className='setting_item password_item w_100 border_box flex flex_column'>
					<div className='setting_content w_100 border_box flex justify_between align_center'>
						<div className='title_wrap flex align_center'>
							<ArrowFatLinesUp size={24}></ArrowFatLinesUp>
							<div className='text_wrap flex flex_column'>
								<span className='title'>{t('setting.Backup.export.title')}</span>
								<span className='desc'>{t('setting.Backup.export.desc')}</span>
							</div>
						</div>
						<div className='value_wrap flex align_center'>
							<button
								className='btn flex justify_center align_center clickable'
								onClick={global.setting.backupExport}
							>
								{t('setting.Backup.export.title')}
							</button>
						</div>
					</div>
				</div>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<div className='title_wrap flex align_center'>
						<ArrowFatLinesDown size={24}></ArrowFatLinesDown>
						<div className='text_wrap flex flex_column'>
							<span className='title'>{t('setting.Backup.import.title')}</span>
							<span className='desc'>{t('setting.Backup.import.desc')}</span>
						</div>
					</div>
					<div className='value_wrap flex align_center'>
						<button
							className='btn flex justify_center align_center clickable'
							onClick={global.setting.backupImport}
						>
							{t('setting.Backup.import.title')}
						</button>
					</div>
				</div>
			</div>
		</Fragment>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
