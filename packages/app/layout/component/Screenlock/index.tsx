import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { Logo, Show } from '@/components'
import { ArrowRight, PlayCircle, Power, XCircle } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsScreenlock } from '@/layout/types'

const Index = (props: IPropsScreenlock) => {
	const { open, close, verify } = props
	const [time, setTime] = useState(() => dayjs())

	useEffect(() => {
		const timer = setInterval(() => setTime(dayjs()), 1000)

		return () => clearInterval(timer)
	}, [])

	const Content = (
		<Show
			className={$cx(styles._local, 'w_100vw h_100vh fixed z_index_1000 flex justify_center align_center')}
			visible={open}
		>
			<div className='bg_wrap w_100 absolute left_0'></div>
			<div className='blur_wrap w_100 h_100 absolute top_0 left_0 flex flex_column align_center justify_center'></div>
			<div className='time_wrap absolute flex justify_center align_center'>
				<span className='time_item text_center'>{time.format('HH')}</span>
				<span className='divide'>:</span>
				<span className='time_item text_center'>{time.format('mm')}</span>
				<span className='divide'>:</span>
				<span className='time_item text_center'>{time.format('ss')}</span>
			</div>
			<Logo className='logo absolute' color='white' size={30}></Logo>
			<span className='slogan absolute'>GTD for professionals.</span>
			<div className='content_wrap flex flex_column align_center justify_center z_index_10'>
				<div className='input_wrap relative'>
					<input className='input w_100 border_box' placeholder='请输入密码' type='password' />
					<button
						className='btn_confirm border_box absolute flex justify_center align_center clickable'
						type='submit'
					>
						<ArrowRight weight='bold'></ArrowRight>
					</button>
				</div>
				<span className='btn_forget mt_12 clickable'>忘记密码</span>
			</div>
			<div className='actions_wrap flex align_center absolute'>
				<div className='action_item flex flex_column align_center'>
					<div className='icon_wrap flex justify_center align_center clickable'>
						<Power size={30} weight='light'></Power>
					</div>
					<span className='text mt_12'>退出</span>
				</div>
				<div className='action_item flex flex_column align_center'>
					<div className='icon_wrap flex justify_center align_center clickable'>
						<PlayCircle size={30} weight='light'></PlayCircle>
					</div>
					<span className='text mt_12'>重启</span>
				</div>
				<div className='action_item flex flex_column align_center'>
					<div className='icon_wrap flex justify_center align_center clickable'>
						<XCircle size={30} weight='light'></XCircle>
					</div>
					<span className='text mt_12'>最小化</span>
				</div>
			</div>
		</Show>
	)

	return createPortal(Content, document.body)
}

export default $app.memo(Index)
