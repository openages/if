import { Progress } from 'antd'
import { observer } from 'mobx-react-lite'

import { useGlobal } from '@/context/app'

import styles from './index.css'

const Index = () => {
	const global = useGlobal()
	const timer = global.timer.timer

	if (!timer) return null

	return (
		<div className={$cx(styles._local)}>
			<Progress
				type='circle'
				strokeColor='var(--color_text)'
				strokeWidth={4}
				size={36}
				percent={timer.percent}
				format={() => `${timer.in.hours}:${timer.in.minutes}`}
			></Progress>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
