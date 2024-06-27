import { useTranslation } from 'react-i18next'

import modules from '../../modules'
import styles from './index.css'

import type { IPropsModuleTab } from '../../types'

const Index = (props: IPropsModuleTab) => {
	const { module, onChangeModule } = props
	const { t } = useTranslation()

	return (
		<div className={$cx('w_100', styles._local)}>
			<div className='module_items flex'>
				{modules.map(item => (
					<span
						className={$cx('module_item clickable', module === item && 'active')}
						key={item}
						onClick={() => onChangeModule(item)}
					>
						{t(`translation:modules.${item}`)}
					</span>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
