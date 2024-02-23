import { Funnel, GearSix } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsHeaderRight } from '../../../../types'

const Index = (props: IPropsHeaderRight) => {
	const { showSettingsModal } = props

	return (
		<div className={$cx('absolute flex align_center', styles._local)}>
			<button className='btn flex justify_center align_center clickable'>
				<Funnel></Funnel>
			</button>
			<button className='btn flex justify_center align_center clickable' onClick={showSettingsModal}>
				<GearSix></GearSix>
			</button>
		</div>
	)
}

export default $app.memo(Index)
