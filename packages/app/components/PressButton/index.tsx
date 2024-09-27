import { useLongPress } from 'ahooks'
import { theme } from 'antd'
import { cloneElement, useEffect, useRef, useState } from 'react'

import styles from './index.css'

import type { PropsWithChildren, CSSProperties, ReactElement } from 'react'

const { useToken } = theme

interface IProps extends PropsWithChildren {
	time: number
	className?: HTMLDivElement['className']
	trigger?: (...args: any) => void
}

const Index = (props: IProps) => {
	const { children, time, className, trigger } = props
	const { token } = useToken()
	const [press_start, setPressStart] = useState(0)
	const [press_time, setPressTime] = useState(0)
	const ref = useRef<HTMLDivElement>(null)

	useLongPress(
		() => {
			setPressStart(Date.now())
		},
		ref,
		{
			delay: 0,
			onLongPressEnd: () => {
				setPressStart(0)
				setPressTime(0)
			}
		}
	)

	useEffect(() => {
		if (!press_start) return

		const timer = setInterval(() => setPressTime((Date.now() - press_start) / 1000), 30)

		return () => clearInterval(timer)
	}, [press_start])

	useEffect(() => {
		if (press_time > time!) {
			trigger?.()
			setPressStart(0)
			setPressTime(0)
		}
	}, [press_time, time])

	return (
		<div className={$cx('flex relative', styles._local, className)} ref={ref}>
			{cloneElement(children as ReactElement, {
				style: { position: 'relative', zIndex: 100, background: 'unset' } as CSSProperties
			})}
			<div
				className='bg_danger_wrap h_100 absolute top_0 left_0'
				style={{
					backgroundColor: token.red2,
					width: `${(press_time * 100) / time!}%`
				}}
			></div>
		</div>
	)
}

export default $app.memo(Index)
