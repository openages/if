import { useMemoizedFn } from 'ahooks'
import { ConfigProvider, Dropdown } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import { todo } from '@/appdata'
import { useText, useTextChange, Text } from '@/Editor'
import { useContextMenu, useHandlers, useOnContextMenu, useOptions } from '@/modules/todo/hooks'
import { CheckCircle, Circle } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsQuadTodoItem } from '../../types'

const Index = (props: IPropsQuadTodoItem) => {
	const {
		item,
		index,
		tags,
		angles,
		zen_mode,
		mode,
		dimension_id,
		makeLinkLine,
		check,
		insert,
		update,
		tab,
		moveTo,
		remove,
		handleOpenItem,
		showDetailModal
	} = props

	const { id, status, text, tag_ids, end_time } = item

	const { onCheck, insertChildren, onKeyDown } = useHandlers({
		item,
		index,
		dimension_id,
		makeLinkLine,
		check,
		insert,
		update,
		tab,
		handleOpenItem
	})

	const { ref_editor, ref_input, onChange, setEditor, setRef } = useText({
		text,
		update: v => update({ type: 'parent', index, dimension_id, value: { text: v } })
	})

	useTextChange({ ref_editor, text })

	const context_menu = useContextMenu({ item, angles, tags, tag_ids })

	const { onContextMenu } = useOnContextMenu({
		item,
		index,
		mode,
		dimension_id,
		update,
		moveTo,
		insert,
		tab,
		remove,
		showDetailModal,
		insertChildren
	})

	useOptions({ item, input: ref_input })

	const outdate = useMemo(
		() => zen_mode && end_time && dayjs(end_time).valueOf() < new Date().valueOf(),
		[zen_mode, end_time]
	)

	const disableContextMenu = useMemoizedFn(e => e.preventDefault())

	return (
		<div
			className={$cx('w_100 border_box flex flex_column', styles.todo_item_wrap)}
			onContextMenu={disableContextMenu}
		>
			<div
				className={$cx(
					'w_100 border_box flex align_start relative',
					styles.todo_item,
					styles[item.status]
				)}
			>
				<div className='w_100 flex'>
					<div
						className='action_wrap flex justify_center align_center cursor_point clickable'
						onClick={onCheck}
					>
						<Choose>
							<When condition={status === 'unchecked' || status === 'closed'}>
								<Circle size={4} weight='fill' />
							</When>
							<When condition={status === 'checked'}>
								<CheckCircle size={12} />
							</When>
						</Choose>
					</div>
					<ConfigProvider getPopupContainer={() => document.body}>
						<Dropdown
							destroyPopupOnHide
							trigger={['contextMenu']}
							overlayStyle={{ width: 132 }}
							menu={{
								items: context_menu,
								onClick: onContextMenu
							}}
						>
							<Text
								id={`todo_${id}`}
								className={$cx('text_wrap', !!outdate && 'outdate')}
								max_length={todo.text_max_length}
								onChange={onChange}
								setEditor={setEditor}
								onKeyDown={onKeyDown}
								setRef={setRef}
							></Text>
						</Dropdown>
					</ConfigProvider>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
