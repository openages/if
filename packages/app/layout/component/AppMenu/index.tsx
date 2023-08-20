import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ModuleIcon } from '@/components'

import styles from './index.css'

import type { IPropsAppMenu } from '../../types'

const Index = (props: IPropsAppMenu) => {
	const { visible, app_modules, actives, onClose } = props
	const { t } = useTranslation()

	return (
		<Modal
			rootClassName={styles._local}
			open={visible}
			width={480}
			centered
			closeIcon={null}
			footer={null}
			onCancel={onClose}
		>
			<div className='menu_items_wrap w_100 border_box flex flex_wrap'>
				{app_modules.map((item) => (
					<Link
						className={$cx(
							'menu_item_wrap border_box',
							actives.find((i) => i.app === item.title) && 'active'
						)}
						key={item.title}
                                    to={ item.path }
                                    onClick={onClose}
					>
						<div className='menu_item flex flex_column align_center'>
							<ModuleIcon type={item.title} size={48} weight='duotone'></ModuleIcon>
							<span className='app_name'>{t(`translation:modules.${item.title}`)}</span>
						</div>
					</Link>
				))}
			</div>
		</Modal>
	)
}

export default $app.memo(Index)
