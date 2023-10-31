import { Drawer } from 'antd'
import { useTranslation } from 'react-i18next'

import Children from '../Children'
import { useInput, useHandlers, useContextMenu } from '../TodoItem/hooks'
import styles from './index.css'

import type { IPropsDetail, IPropsChildren } from '../../types'

const Index = (props: IPropsDetail) => {
	const { visible_detail_modal, current_detail_index, current_detail_item, update, tab, closeDetailModal } = props
	const { t } = useTranslation()
	const { status, children } = current_detail_item
	const { input, onInput } = useInput({
		item: current_detail_item,
		index: current_detail_index,
		update
	})
	const { insertChildren, removeChildren } = useHandlers({
		item: current_detail_item,
		index: current_detail_index,
		visible_detail_modal,
		update
	})
	const { ChildrenContextMenu } = useContextMenu({})

	const props_children: IPropsChildren = {
		items: children,
		index: current_detail_index,
		fold: false,
		isDragging: false,
		useByDetail: true,
		handled: status === 'checked' || status === 'closed',
		ChildrenContextMenu,
		update,
		tab,
		insertChildren,
		removeChildren
	}

	return (
		<Drawer
			rootClassName={$cx('hide_mask', styles._local)}
			open={visible_detail_modal}
			title={t('translation:todo.Detail.title')}
			width={360}
			mask={false}
			destroyOnClose
			getContainer={document.body}
			onClose={closeDetailModal}
		>
			{current_detail_item.id && (
				<div className='detail_item_wrap w_100 border_box flex flex_column'>
					<div className='todo_text_wrap w_100' ref={input} contentEditable onInput={onInput}></div>
					{current_detail_item.children && <Children {...props_children}></Children>}
				</div>
			)}
		</Drawer>
	)
}

export default $app.memo(Index)
