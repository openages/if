import { Progress } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'

import { useGlobal } from '@/context/app'

import styles from './index.css'

const Index = () => {
	const global = useGlobal()
	const timer = global.timer.timer
	const percent = timer?.percent
	const [blink, setBlink] = useState(false)
	const timeout = useRef<NodeJS.Timeout>(null)

	useEffect(() => {
		if (percent !== 100) return

		setBlink(true)

		timeout.current = setTimeout(() => setBlink(false), 12 * 1000)
	}, [percent])

	useEffect(() => {
		if (!blink && timeout.current) clearTimeout(timeout.current)
	}, [blink])

	if (!timer) return null

	return (
		<div className={$cx(styles._local, blink && styles.blink)}>
			<Progress
				type='circle'
				strokeColor='var(--color_text)'
				strokeWidth={4}
				size={36}
				percent={percent}
				format={() => `${timer.in.hours}:${timer.in.minutes}`}
			></Progress>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
