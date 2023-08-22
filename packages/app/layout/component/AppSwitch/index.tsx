import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'

import { ModuleIcon } from '@/components'

import styles from './index.css'

import type { IPropsAppSwitch } from '../../types'

const Index = (props: IPropsAppSwitch) => {
	const { visible, actives, switch_index, onClose, changeSwitchIndex, handleAppSwitch } = props
	const { t } = useTranslation()

	return (
		<Modal
			rootClassName={styles._local}
			open={visible}
			width='auto'
			zIndex={10000}
			centered
			mask={false}
			closeIcon={null}
			footer={null}
			onCancel={onClose}
		>
			<div className='switch_items_wrap w_100 border_box flex'>
				{actives.map((item, index) => (
					<div
						className={$cx(
							'switch_item_wrap border_box flex flex_column align_center cursor_point',
							switch_index === index && 'active'
						)}
						key={item.app}
						onMouseMove={() => changeSwitchIndex(index)}
						onClick={handleAppSwitch}
					>
						<ModuleIcon type={item.app} size={36} weight='duotone'></ModuleIcon>
						<span className='app_name'>{t(`translation:modules.${item.app}`)}</span>
					</div>
				))}
			</div>
		</Modal>
	)
}

export default $app.memo(Index)
