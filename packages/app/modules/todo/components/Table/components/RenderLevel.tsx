import { getArray, getColorByLevel } from '@/appdata'
import { FireSimple } from '@phosphor-icons/react'

import Level from '../../Level'
import styles from '../index.css'

import type { Todo } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const array = getArray(4)

const Index = (props: IPropsFormTableComponent<Todo.Todo['level']>) => {
	const { value, editing, onFocus, onBlur, onChange } = props

	return (
		<div className={$cx('flex justify_center', styles.RenderLevel)}>
			{editing ? (
				<Level value={value} onChangeLevel={onChange!} onFocus={onFocus} onBlur={onBlur}></Level>
			) : (
				<div className={$cx('w_100 flex justify_center', styles.RenderLevelViewer)}>
					{array.map((_, index) => (
						<FireSimple
							className={$cx('level_item', value! >= index + 1 && 'active')}
							size={15}
							weight={value! >= index + 1 ? 'duotone' : 'regular'}
							style={{ '--color_star': getColorByLevel(value!) || 'var(--color_text)' }}
							key={index}
						/>
					))}
				</div>
			)}
		</div>
	)
}

export default $app.memo(Index)
