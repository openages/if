import { useLongPress } from 'ahooks'
import { theme } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { contextMenu, Item } from 'react-contexify'

import styles from './index.css'

import type { ItemProps } from 'react-contexify'
import type { Icon } from '@phosphor-icons/react'

const { useToken } = theme

interface IProps {
	itemProps?: Omit<ItemProps, 'children'>
	Icon: Icon
	text: string
	danger?: number
	className?: HTMLDivElement['className']
	trigger?: (...args: any) => void
}

const PressItem = $app.memo((props: IProps) => {
	const { itemProps, Icon, text, danger, className, trigger } = props
	const { token } = useToken()
	const [press_start, setPressStart] = useState(0)
	const [press_time, setPressTime] = useState(0)
	const ref = useRef<HTMLDivElement>(null)

	useLongPress(() => setPressStart(Date.now()), ref, {
		delay: 0,
		onLongPressEnd: () => {
			setPressStart(0)
			setPressTime(0)
		}
	})

	useEffect(() => {
		if (!press_start) return

		const timer = setInterval(() => setPressTime((Date.now() - press_start) / 1000), 30)

		return () => clearInterval(timer)
	}, [press_start])

	useEffect(() => {
		if (press_time > danger!) {
			trigger?.()
			setPressStart(0)

			contextMenu.hideAll()
		}
	}, [press_time, danger])

	return (
		<Item {...itemProps}>
			<div className={$cx('flex w_100 h_100 relative', styles._local, className)} ref={ref}>
				<div className=' flex align_center w_100 h_100 relative z_index_10'>
					<Icon className='' size={16} weight='bold'></Icon>
					<span className='text ml_6 font_bold'>{text}</span>
				</div>
				<div
					className='bg_danger_wrap h_100 absolute top_0 left_0'
					style={{ backgroundColor: token.red2, width: `${(press_time * 100) / danger!}%` }}
				></div>
			</div>
		</Item>
	)
})

const Index = (props: IProps) => {
	const { itemProps, Icon, text, danger, className } = props

	if (danger) return <PressItem {...props}></PressItem>

	return (
		<Item {...itemProps}>
			<div className={$cx('flex align_center w_100 h_100', styles._local, className)}>
				<Icon size={16} weight='bold'></Icon>
				<span className='text ml_6 font_bold'>{text}</span>
			</div>
		</Item>
	)
}

export default $app.memo(Index)
