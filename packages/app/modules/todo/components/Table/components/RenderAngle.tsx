import { Select } from 'antd'
import { useMemo } from 'react'

import styles from '../index.css'

import type { Todo, Tag } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['angle_id'], { angles: Array<Tag> }>) => {
	const { value, extra, editing, onFocus, onChange } = props
	const { angles } = extra

	const target_angle = useMemo(() => angles.find(item => item.id === value), [value, angles])

	return (
		<div className={$cx('flex justify_center align_center', styles.RenderAngle)} style={{ overflow: 'scroll' }}>
			{editing ? (
				<Select
					className='borderless no_suffix'
					popupClassName='borderless'
					size='small'
					variant='borderless'
					virtual={false}
					suffixIcon={null}
					fieldNames={{ label: 'text', value: 'id' }}
					options={angles}
					value={value}
					getPopupContainer={() => document.body}
					onDropdownVisibleChange={onFocus}
					onChange={onChange}
				></Select>
			) : (
				target_angle.text
			)}
		</div>
	)
}

export default $app.memo(Index)
