import { useTranslation } from 'react-i18next'

import { MagnifyingGlass } from '@phosphor-icons/react'

import styles from './index.css'

const Index = () => {
	const { t } = useTranslation()

	return (
		<div className={$cx('w_100 border_box relative flex align_center', styles._local)}>
			<MagnifyingGlass className='icon_search absolute' size={16}></MagnifyingGlass>
			<input
				className='input_search w_100'
				type='search'
				placeholder={t('translation:dirtree.search_placeholder')}
				disabled
			/>
		</div>
	)
}

export default $app.memo(Index)
