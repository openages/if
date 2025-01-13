import { useMemoizedFn } from 'ahooks'
import { xxHash32 } from 'js-xxhash'
import { useMemo } from 'react'
import { local } from 'stk/dist/storage'
import genColor from 'uniqolor'

import { CheckCircle, CheckSquare, Circle, Square } from '@phosphor-icons/react'

import styles from '../index.css'

import type { IPropsFormTableComponent } from '@/components'
import type { CSSProperties } from 'react'
import type { Todo } from '@/types'

const Index = (props: IPropsFormTableComponent<Todo.Todo['status']>) => {
	const { value, deps, getProps, onChange } = props
	const linked = getProps!({ id: deps.id, status: value })

	const style = useMemo(() => {
		if (!linked) return {} as CSSProperties

		return {
			'--color_relation_group': genColor(xxHash32(linked).toString(3), {
				saturation: 72,
				lightness: local.theme === 'light' ? [30, 72] : 72
			}).color
		}
	}, [linked])

	const onCheck = useMemoizedFn(() => {
		if (value === 'closed') return

		onChange!(value === 'unchecked' ? 'checked' : 'unchecked')
	})

	return (
		<div
			className={$cx(
				'flex border_box justify_center align_center cursor_point clickable',
				styles.RenderStatus
			)}
			style={style}
			onClick={onCheck}
		>
			<Choose>
				<When condition={value === 'unchecked' || value === 'closed'}>
					{linked ? <Circle size={16} weight='duotone' /> : <Square size={16} weight='regular' />}
				</When>
				<When condition={value === 'checked'}>
					{linked ? <CheckCircle size={16} weight='duotone' /> : <CheckSquare size={16} />}
				</When>
			</Choose>
		</div>
	)
}

// export default new $app.handle(Index).by(observer).by($app.memo).get()

export default $app.memo(Index)
