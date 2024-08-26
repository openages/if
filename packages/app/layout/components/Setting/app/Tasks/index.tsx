import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { container } from 'tsyringe'

import { ModuleIcon } from '@/components'
import { GlobalModel } from '@/context/app'
import { Power } from '@phosphor-icons/react'

import styles from './index.css'

const Index = () => {
	const [global] = useState(() => container.resolve(GlobalModel))
	const actives = $copy(global.app.actives)
	const { t } = useTranslation()

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			{actives.map(item => (
				<div className='app_module_item_wrap w_100 border_box' key={item.app}>
					<div className='app_module_item setting_item w_100 border_box flex justify_between align_center'>
						<div className='module_icon flex align_center'>
							<ModuleIcon type={item.app} size={24} weight='duotone'></ModuleIcon>
							<span className='name ml_12'>{t(`modules.${item.app}`)}</span>
						</div>
						<div
							className='btn_wrap btn_action flex justify_end align_center ml_12 clickable'
							onClick={() => $app.Event.emit('global.app.exitApp', item.app)}
						>
							<Power size={16} weight='bold'></Power>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
