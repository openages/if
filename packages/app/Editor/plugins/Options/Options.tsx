import { useTranslation } from 'react-i18next'

import { ArrowLineDown, Export, FileMd } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsOptions } from './types'

const Index = (props: IPropsOptions) => {
	const { exportMd, importMd } = props
	const { t } = useTranslation()

	return (
		<div className={$cx('border_box', styles.options)}>
			<div className='option_items w_100 border_box flex flex_column'>
				<div
					className='option_item w_100 border_box flex justify_between align_center cursor_point'
					onClick={exportMd}
				>
					<div className='flex align_center'>
						<Export size={16}></Export>
						<span className='title ml_6'>{t('common.export')}</span>
					</div>
					<FileMd className='symbol' size={12}></FileMd>
				</div>
				{/* <div
					className='option_item w_100 border_box flex justify_between align_center cursor_point'
					onClick={importMd}
				>
					<div className='flex align_center'>
						<ArrowLineDown size={16}></ArrowLineDown>
						<span className='title ml_6'>{t('common.import')}</span>
					</div>
					<FileMd className='symbol' size={12}></FileMd>
				</div> */}
			</div>
		</div>
	)
}

export default $app.memo(Index)
