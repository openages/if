import { observer } from 'mobx-react-lite'

import { useGlobal } from '@/context/app'
import { CrownSimple } from '@phosphor-icons/react'

import styles from './index.css'

interface IProps {
	type: 'element' | 'card' | 'btn'
	no_bg?: boolean
}

const Index = (props: IProps) => {
	const { type, no_bg } = props
	const global = useGlobal()
	const paid = global.auth.is_paid_user

	if (paid) return null

	return (
		<div
			className={$cx(
				'flex justify_center align_center',
				styles._local,
				styles[type],
				no_bg && styles.no_bg
			)}
		>
			<CrownSimple weight='fill'></CrownSimple>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
