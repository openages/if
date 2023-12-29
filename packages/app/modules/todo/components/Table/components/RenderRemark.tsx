import { Popover } from 'antd'

import { TextAlignCenter } from '@phosphor-icons/react'

import Remark from '../../Remark'
import styles from '../index.css'

import type { CustomFormItem, Todo } from '@/types'

const Index = (props: CustomFormItem<Todo.Todo['remark']>) => {
	const { value, onChange } = props

	return (
		<div className={$cx('flex justify_center', styles.RenderRemark, value && styles.has_value)}>
			<Popover
				rootClassName={styles.RenderRemarkPopover}
				content={<Remark remark={value} updateRemark={onChange}></Remark>}
				trigger='click'
				destroyTooltipOnHide
				getPopupContainer={() => document.body}
			>
				<div>
					<div className='btn_remark flex justify_center align_center clickable'>
						<TextAlignCenter size={14}></TextAlignCenter>
					</div>
				</div>
			</Popover>
		</div>
	)
}

export default $app.memo(Index)
