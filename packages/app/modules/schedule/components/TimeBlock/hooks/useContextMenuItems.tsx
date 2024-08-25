import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Copy, Info, Trash } from '@phosphor-icons/react'

import type { MenuProps } from 'antd'

export default () => {
	const { t, i18n } = useTranslation()

	return useMemo(
		() =>
			[
				{
					key: 'check',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<Info size={14}></Info>
							<span className='text ml_6'>{t('common.check')}</span>
						</div>
					)
				},
				{
					key: 'copy',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<Copy size={14}></Copy>
							<span className='text ml_6'>{t('common.copy')}</span>
						</div>
					)
				},
				{
					key: 'remove',
					label: (
						<div className='menu_item_wrap flex align_center'>
							<Trash size={14}></Trash>
							<span className='text ml_6'>{t('common.remove')}</span>
						</div>
					)
				}
			] as MenuProps['items'],
		[i18n.language]
	)
}
