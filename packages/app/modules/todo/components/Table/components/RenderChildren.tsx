import { Progress } from 'antd'
import { match, P } from 'ts-pattern'

import { Minus } from '@phosphor-icons/react'

import styles from '../index.css'

import type { Todo } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['children']>) => {
	const { value } = props

	const checked_children = value?.filter(item => item.status === 'checked')

	return (
		<div
			className={$cx(
				'flex justify_center align_center',
				styles.RenderChildren,
				!value?.length && styles.no_children
			)}
		>
			{match(value)
				.with(P.nullish, () => <Minus size={14}></Minus>)
				.with(
					P.when(v => !v.length),
					() => <Minus size={14}></Minus>
				)
				.otherwise(() => (
					<Progress
						className='progress'
						type='circle'
						size={16}
						showInfo={false}
						strokeColor='var(--color_text_sub)'
						trailColor='var(--color_bg_2)'
						strokeWidth={12}
						steps={{ count: value!.length, gap: 8 }}
						percent={(checked_children!.length * 100) / value!.length}
					></Progress>
				))}
		</div>
	)
}

export default $app.memo(Index)
