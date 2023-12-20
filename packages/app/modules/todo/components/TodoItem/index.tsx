import { useDebounce, useMemoizedFn, useSize, useUpdateEffect } from 'ahooks'
import { ConfigProvider, Dropdown } from 'antd'
import { useRef } from 'react'
import { Case, Switch } from 'react-if'

import { CSS } from '@dnd-kit/utilities'
import { CheckSquare, DotsSixVertical, Square, Star } from '@phosphor-icons/react'
import { useInput } from '../../hooks'
import Children from '../Children'
import CycleStatus from '../CycleStatus'
import RemindStatus from '../RemindStatus'
import TagSelect from '../TagSelect'
import { useContextMenu, useHandlers, useLink, useOnContextMenu, useOpen } from './hooks'
import styles from './index.css'

import type { IPropsChildren, IPropsTodoItem } from '../../types'

const Index = (props: IPropsTodoItem) => {
	const {
		sortable_props,
		item,
		index,
		tags,
		angles,
		drag_disabled,
		kanban_mode,
		kanban_index,
		dimension_id,
		makeLinkLine,
		renderLines,
		check,
		updateRelations,
		insert,
		update,
		tab,
		moveTo,
		remove,
		showDetailModal
	} = props

	const {
		id,
		status,
		text,
		open,
		tag_ids,
		star,
		remind_time,
		cycle_enabled,
		cycle,
		recycle_time,
		options_width,
		children
	} = item

	const { attributes, listeners, transform, transition, isDragging, setNodeRef, setActivatorNodeRef } =
		sortable_props

	const {
		setOpen,
		onCheck,
		onDrag,
		toggleChildren,
		insertChildren,
		removeChildren,
		onKeyDown,
		updateTags,
		updateTagWidth
	} = useHandlers({ item, index, dimension_id, makeLinkLine, check, insert, update, tab })

	const { linker, dragging, hovering } = useLink({ item, makeLinkLine, updateRelations })

	const { input, onInput } = useInput({
		value: text,
		update: useMemoizedFn(textContent => update({ type: 'parent', index, value: { text: textContent } }))
	})

	const { TodoContextMenu, ChildrenContextMenu } = useContextMenu({ angles, tags, tag_ids })

	const { onContextMenu } = useOnContextMenu({
		item,
		index,
		kanban_mode,
		kanban_index,
		dimension_id,
		update,
		moveTo,
		insert,
		tab,
		remove,
		showDetailModal,
		insertChildren
	})

	const options_wrap = useRef<HTMLDivElement>(null)
	const options_size = useSize(options_wrap)
	const real_options_size = useDebounce(options_size, { wait: 60 })

	useUpdateEffect(() => {
		if (real_options_size?.width === undefined) return

		updateTagWidth(real_options_size.width)
	}, [real_options_size])

	useOpen({ item, input, isDragging, renderLines, setOpen })

	const props_children: IPropsChildren = {
		items: children,
		index,
		fold: !open,
		isDragging,
		handled: item.status === 'checked' || item.status === 'closed',
		dimension_id,
		ChildrenContextMenu,
		update,
		tab,
		insertChildren,
		removeChildren
	}

	const OptionsWrap = (
		<div className={$cx('options_container flex absolute z_index_10', !options_width && 'no_options')}>
			<div className='options_wrap border_box flex align_center' ref={options_wrap}>
				{tags?.length > 0 && tag_ids?.length > 0 && (
					<TagSelect options={tags} value={tag_ids} useByTodo onChange={updateTags}></TagSelect>
				)}
				{star > 0 && (
					<div
						className='other_wrap white flex justify_center align_center'
						style={{ color: `rgba(var(--color_main_rgb),${(star / 6).toFixed(2)})` }}
					>
						<Star className='icon' size={10} weight='duotone'></Star>
					</div>
				)}
				{remind_time && <RemindStatus remind_time={remind_time}></RemindStatus>}
				{cycle_enabled && cycle && (
					<CycleStatus cycle={cycle} recycle_time={recycle_time}></CycleStatus>
				)}
			</div>
		</div>
	)

	return (
		<div
			className={$cx(
				'w_100 border_box flex flex_column',
				styles.todo_item_wrap,
				kanban_mode && styles.kanban_mode
			)}
		>
			{kanban_mode && OptionsWrap}
			<div
				className={$cx(
					'w_100 border_box flex align_start relative',
					styles.todo_item,
					styles[item.status]
				)}
				ref={setNodeRef}
				style={{ transform: CSS.Translate.toString(transform), transition }}
			>
				{!drag_disabled && (
					<div
						id={id}
						className={$cx(
							'dot_wrap border_box flex justify_center align_center absolute transition_normal cursor_point z_index_10',
							dragging && 'dragging',
							hovering && 'hovering'
						)}
						ref={linker}
						onDrag={onDrag}
						onClick={toggleChildren}
					></div>
				)}
				{!drag_disabled && (
					<div
						className={$cx(
							'drag_wrap todo border_box flex justify_center align_center absolute transition_normal cursor_point z_index_10'
						)}
						ref={setActivatorNodeRef}
						{...attributes}
						{...listeners}
					>
						<DotsSixVertical size={12} weight='bold'></DotsSixVertical>
					</div>
				)}
				<div className='w_100 flex'>
					<div
						className='action_wrap flex justify_center align_center cursor_point clickable'
						onClick={onCheck}
					>
						<Switch>
							<Case condition={status === 'unchecked' || status === 'closed'}>
								<Square size={16} />
							</Case>
							<Case condition={status === 'checked'}>
								<CheckSquare size={16} />
							</Case>
						</Switch>
					</div>
					{!kanban_mode && OptionsWrap}
					<ConfigProvider getPopupContainer={() => document.body}>
						<Dropdown
							destroyPopupOnHide
							trigger={['contextMenu']}
							overlayStyle={{ width: 132 }}
							menu={{ items: TodoContextMenu, onClick: onContextMenu }}
						>
							<div
								id={`todo_${id}`}
								className={$cx(
									'text_wrap',
									children && children?.length && !open && 'has_children'
								)}
								contentEditable='plaintext-only'
								ref={input}
								style={{
									textIndent:
										!kanban_mode && options_width ? options_width : 'unset'
								}}
								onInput={onInput}
								onKeyDown={onKeyDown}
							></div>
						</Dropdown>
					</ConfigProvider>
				</div>
			</div>
			<Children {...props_children}></Children>
		</div>
	)
}

export default $app.memo(Index)
