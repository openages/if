import { useTranslation } from 'react-i18next'

import { MagnifyingGlass } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsSearch } from '../../types'

const Index = (props: IPropsSearch) => {
	const { showSearch } = props
	const { t } = useTranslation()

	return (
		<div
			className={$cx('w_100 border_box relative flex align_center cursor_point', styles._local)}
			onClick={showSearch}
		>
			<MagnifyingGlass className='icon_search absolute' size={16}></MagnifyingGlass>
			<span className='search w_100 cursor_point'>{t('translation:dirtree.search_placeholder')}</span>
		</div>
	)
}

export default $app.memo(Index)
