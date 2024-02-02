import { useMemoizedFn } from 'ahooks'
import { Button, Popover } from 'antd'
import { useMemo, useState } from 'react'
import { match } from 'ts-pattern'

import { Wave } from '@/components'
import { PencilSimple, PersonSimpleRun, Play, Plus, SkipForward, Stop } from '@phosphor-icons/react'

import SessionEditor from '../SessionEditor'
import styles from './index.css'

import type { IPropsActions } from '../../types'
const Index = (props: IPropsActions) => {
	const { add, toggleEditModal } = props
	const [add_open, setAddOpen] = useState(false)

	const actions = useMemo(
		() => [
			{ type: 'edit', Icon: PencilSimple, text: '编辑' },
			{ type: 'start', Icon: Play, text: '开始', start: true },
			{ type: 'next', Icon: SkipForward, text: '下一个' },
			{ type: 'continuous', Icon: PersonSimpleRun, text: '铁人模式', active: true }
		],
		[]
	)

	const onAddOpenChange = useMemoizedFn((v?: boolean) => setAddOpen(v ? v : false))

	const onAction = useMemoizedFn(e => {
		let target = e.target as HTMLButtonElement
		let type = target.getAttribute('data-type') as (typeof actions)[number]['type']

		if (!type) {
			target = target.parentElement as HTMLButtonElement
			type = target.getAttribute('data-type') as (typeof actions)[number]['type']
		}

		if (!type) return

		match(type)
			.with('edit', () => toggleEditModal())
			.with('start', () => {})
			.with('next', () => {})
			.with('continuous', () => {})
			.otherwise(() => {})
	})

	return (
		<div
			className={$cx('actions_wrap w_100 border_box flex justify_between align_center', styles._local)}
			onClick={onAction}
		>
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
			{actions.map(({ type, Icon, text, active }, index) => (
				<div className='action_item flex flex_column align_center' key={index}>
					<Wave>
						<Button
							className={$cx(
								'icon_wrap flex justify_center align_center clickable',
								active && 'active'
							)}
							data-type={type}
						>
							<Icon size={21} weight='bold' data-type={type}></Icon>
						</Button>
					</Wave>
					<span className='text'>{text}</span>
				</div>
			))}
		</div>
	)
}

export default $app.memo(Index)
