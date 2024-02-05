import { useMemoizedFn } from 'ahooks'
import { Button, Popover } from 'antd'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { Wave } from '@/components'
import { PencilSimple, PersonSimpleRun, Play, Plus, SkipForward, Stop } from '@phosphor-icons/react'

import SessionEditor from '../SessionEditor'
import styles from './index.css'

import type { IPropsActions } from '../../types'

const Index = (props: IPropsActions) => {
	const { going, continuous_mode, flow_mode, add, toggleGoing, next, toggleContinuousMode, toggleEditModal } = props
	const [add_open, setAddOpen] = useState(false)
	const { t } = useTranslation()

	const actions = useMemo(
		() => [
			{ type: 'edit', Icon: PencilSimple, text: t('translation:pomo.Actions.edit') },
			{
				type: 'start',
				Icon: going ? Stop : Play,
				text: going ? t('translation:common.stop') : t('translation:common.start')
			},
			{ type: 'next', Icon: SkipForward, text: t('translation:pomo.Actions.next') },
			{
				type: 'continuous',
				Icon: PersonSimpleRun,
				text: t('translation:pomo.Actions.continuous'),
				active: continuous_mode,
				disabled: flow_mode
			}
		],
		[going, continuous_mode, flow_mode]
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
			.with('start', () => toggleGoing())
			.with('next', () => next())
			.with('continuous', () => toggleContinuousMode())
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
					<span className='text'>{t('translation:pomo.Actions.add')}</span>
				</div>
			</Popover>
			{actions.map(({ type, Icon, text, active, disabled }, index) => (
				<div className='action_item flex flex_column align_center' key={index}>
					<Wave>
						<Button
							className={$cx(
								'icon_wrap flex justify_center align_center clickable',
								!disabled && active && 'active',
								disabled && 'disabled'
							)}
							data-type={type}
						>
							<Icon className='icon' size={21} weight='bold' data-type={type}></Icon>
						</Button>
					</Wave>
					<span className='text'>{text}</span>
				</div>
			))}
		</div>
	)
}

export default $app.memo(Index)
