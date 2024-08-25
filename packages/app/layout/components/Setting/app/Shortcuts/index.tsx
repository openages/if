import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { container } from 'tsyringe'

import { GlobalModel } from '@/context/app'

import icons from './icons'
import styles from './index.css'

const Index = () => {
	const [global] = useState(() => container.resolve(GlobalModel))
	const keys = $copy(global.shortcuts.keys)
	const { t } = useTranslation()

	const getKeyMap = useMemoizedFn((item: GlobalModel['shortcuts']['keys'][number]) => {
		const key = item.special_key || global.shortcuts.getKeybinds(item.key_bindings)

		if (key.indexOf(',') !== -1) return key.split(',')

		return key.split('+')
	})

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			{keys.map((item, index) => (
				<div className='row_item_wrap w_100 border_box' key={index}>
					<div className='row_item setting_item w_100 border_box flex justify_between align_center'>
						<span className='name'>{t(`translation:shortcuts.${item.event_path}`)}</span>
						<div className='flex align_center'>
							<span className='key_action'>
								{item?.options?.keyup ? t('shortcuts.keyup') : t('shortcuts.keydown')}
							</span>
							<div className='key_bindings flex justify_end'>
								{getKeyMap(item).map(key => {
									const Icon = icons[key]

									return (
										<span className='key flex align_center ml_4' key={key}>
											{Icon ? (
												<Icon size={12} weight='bold'></Icon>
											) : (
												key.toUpperCase()
											)}
										</span>
									)
								})}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
