import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Wave } from '@/components'
import { PersonSimpleRun, Play, Plus, SkipForward, Stop } from '@phosphor-icons/react'

import styles from './index.css'
import Model from './model'
import { IProps } from './types'

const Index = ({ id }: IProps) => {
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.init({ id })

		return () => x.off()
	}, [id])

	const actions = [
		{ Icon: Plus, text: '添加' },
		{ Icon: Play, text: '开始' },
		{ Icon: Stop, text: '停止' },
		{ Icon: SkipForward, text: '下一个' },
		{ Icon: PersonSimpleRun, text: '铁人模式', active: true }
	]

	return (
		<div className={$cx('w_100 h_100 border_box flex flex_column', styles._local)}>
			<div className='sessions_wrap flex'></div>
			<div className='actions_wrap  w_100 border_box flex justify_between align_center'>
				{actions.map(({ Icon, text, active }, index) => (
					<div className='action_item flex flex_column align_center' key={index}>
						<Wave>
							<Button
								className={$cx(
									'icon_wrap flex justify_center align_center clickable',
									active && 'active'
								)}
							>
								<Icon size={21} weight='bold'></Icon>
							</Button>
						</Wave>
						<span className='text'>{text}</span>
					</div>
				))}
			</div>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
