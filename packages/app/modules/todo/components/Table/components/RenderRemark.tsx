import { Popover } from 'antd'

import { TextAlignCenter } from '@phosphor-icons/react'

import Remark from '../../Remark'
import styles from '../index.css'

import type { Todo } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['remark']>) => {
	const { value, editing, onFocus, onChange } = props

	const Trigger = (
		<div>
			<div className='btn_remark flex justify_center align_center clickable'>
				<TextAlignCenter size={14}></TextAlignCenter>
			</div>
		</div>
	)

	return (
		<div className={$cx('flex justify_center', styles.RenderRemark, value && styles.has_value)}>
			{editing ? (
				<Popover
					rootClassName={styles.RenderRemarkPopover}
					content={<Remark remark={value} updateRemark={onChange}></Remark>}
					trigger='click'
					destroyTooltipOnHide
					getPopupContainer={() => document.body}
					onOpenChange={onFocus}
				>
					{Trigger}
				</Popover>
			) : (
				Trigger
			)}
		</div>
	)
}

export default $app.memo(Index)
