import { useMemoizedFn } from 'ahooks'
import { Button, Popover } from 'antd'
import { useState } from 'react'

import { Wave } from '@/components'
import { PencilSimple, PersonSimpleRun, Play, Plus, SkipForward, Stop } from '@phosphor-icons/react'

import SessionEditor from '../SessionEditor'
import styles from './index.css'

import type { IPropsActions } from '../../types'
const Index = (props: IPropsActions) => {
	const { add } = props
	const [add_open, setAddOpen] = useState(false)

	const actions = [
		{ Icon: PencilSimple, text: '编辑' },
		{ Icon: Play, text: '开始', start: true },
		{ Icon: SkipForward, text: '下一个' },
		{ Icon: PersonSimpleRun, text: '铁人模式', active: true }
	]

	const onAddOpenChange = useMemoizedFn((v?: boolean) => setAddOpen(v ? v : false))

	return (
		<div className={$cx('w_100 border_box flex justify_between align_center', styles._local)}>
			<Popover
				open={add_open}
				trigger='click'
				content={<SessionEditor onChange={add} close={onAddOpenChange}></SessionEditor>}
				onOpenChange={onAddOpenChange}
			>
				<div className='action_item flex flex_column align_center'>
					<Wave>
						<Button className={$cx('icon_wrap flex justify_center align_center clickable')}>
							<Plus size={21} weight='bold'></Plus>
						</Button>
					</Wave>
					<span className='text'>添加</span>
				</div>
			</Popover>
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
	)
}

export default $app.memo(Index)
