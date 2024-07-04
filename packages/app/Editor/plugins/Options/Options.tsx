import { useTranslation } from 'react-i18next'

import { ArrowLineDown, ArrowSquareDown, Export, FileMd } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsOptions } from './types'

const Index = (props: IPropsOptions) => {
	const { exportMd, importMd, batchImportMd } = props
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
						<span className='title ml_6'>{t('translation:common.export')}</span>
					</div>
					<FileMd className='symbol' size={12}></FileMd>
				</div>
				<div
					className='option_item w_100 border_box flex justify_between align_center cursor_point'
					onClick={importMd}
				>
					<div className='flex align_center'>
						<ArrowLineDown size={16}></ArrowLineDown>
						<span className='title ml_6'>{t('translation:common.import')}</span>
					</div>
					<FileMd className='symbol' size={12}></FileMd>
				</div>
				<div
					className='option_item w_100 border_box flex justify_between align_center cursor_point'
					onClick={batchImportMd}
				>
					<div className='flex align_center'>
						<ArrowSquareDown size={16}></ArrowSquareDown>
						<span className='title ml_6'>{`${t('translation:common.import')}${t('translation:common.letter_space')}${t('translation:common.multiple')}`}</span>
					</div>
					<FileMd className='symbol' size={12}></FileMd>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
