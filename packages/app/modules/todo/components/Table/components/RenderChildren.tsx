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
				.with(
					P.when(v => v.length <= 6),
					() => (
						<Progress
							className='progress'
							size='small'
							showInfo={false}
							steps={value.length}
							percent={(checked_children.length * 100) / value.length}
						></Progress>
					)
				)
				.otherwise(() => `${checked_children?.length}/${value.length}`)}
		</div>
	)
}

export default $app.memo(Index)
