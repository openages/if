import { useMemoizedFn } from 'ahooks'
import { Drawer } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { getItemStatus } from '@/utils/modules/todo'
import { Bell, Calendar, CaretDown, CaretUp, FireSimple, Plus, Repeat, Sun, Tag, X } from '@phosphor-icons/react'

import { useInput } from '../../hooks'
import Children from '../Children'
import Cycle from '../Cycle'
import DateTime from '../DateTime'
import Level from '../Level'
import Remark from '../Remark'
import TagSelect from '../TagSelect'
import { useContextMenu, useHandlers } from '../TodoItem/hooks'
import styles from './index.css'

import type { Todo } from '@/types'
import type { IPropsChildren, IPropsDetail } from '../../types'

const Index = (props: IPropsDetail) => {
	const {
		breakpoint,
		mode,
		kanban_mode,
		visible_detail_modal,
		current_detail_index,
		current_detail_item,
		relations,
		tags,
		update,
		tab,
		closeDetailModal,
		clearCurrentDetail,
		setCurrentDetailIndex
	} = props
	const { t } = useTranslation()
	const { item = {} as Todo.Todo, prev_id, next_id } = current_detail_item
	const {
		id,
		status,
		text,
		children,
		tag_ids,
		level,
		remind_time,
		cycle_enabled,
		cycle,
		end_time,
		schedule,
		remark
	} = item

	const { input, onInput } = useInput({
		value: text,
		update: useMemoizedFn(textContent =>
			update({
				type: 'parent',
				index: current_detail_index.index,
				dimension_id: current_detail_index.dimension_id,
				value: { text: textContent }
			})
		)
	})

	const {
		updateValues,
		updateTags,
		updateLevel,
		updateRemind,
		updateDeadline,
		updateCycle,
		updateSchedule,
		updateRemark,
		insertChildren,
		removeChildren
	} = useHandlers({
		item,
		index: current_detail_index.index,
		kanban_mode,
		dimension_id: current_detail_index.dimension_id,
		visible_detail_modal,
		update
	})

	const { ChildrenContextMenu } = useContextMenu({ kanban_mode, mode })

	const item_status = useMemo(() => getItemStatus({ relations, id, status }), [relations, id, status])

	const props_children: IPropsChildren = {
		items: children,
		index: current_detail_index.index,
		open: true,
		isDragging: false,
		useByDetail: true,
		handled: status === 'checked' || status === 'closed',
		dimension_id: current_detail_index.dimension_id,
		ChildrenContextMenu,
		update,
		tab,
		insertChildren,
		removeChildren
	}

	return (
		<Drawer
			rootClassName={$cx(
				'useInPage',
				styles._local,
				breakpoint && styles.breakpoint,
				breakpoint === 390 && styles.narrow,
				breakpoint && 'breakpoint'
			)}
			open={visible_detail_modal}
			mask={Boolean(breakpoint)}
			title={t('translation:todo.Detail.title')}
			width={321}
			zIndex={100}
			destroyOnClose
			getContainer={false}
			onClose={closeDetailModal}
			afterOpenChange={clearCurrentDetail}
		>
			<div className='toggle_wrap flex absolute'>
				<div
					className={$cx(
						'btn_toggle flex justify_center align_center clickable mr_6',
						!prev_id && 'disabled'
					)}
					onClick={() =>
						setCurrentDetailIndex({
							id: prev_id,
							index: current_detail_index.index - 1,
							dimension_id: current_detail_index.dimension_id
						})
					}
				>
					<CaretUp size={16}></CaretUp>
				</div>
				<div
					className={$cx(
						'btn_toggle flex justify_center align_center clickable',
						!current_detail_item.next_id && 'disabled'
					)}
					onClick={() =>
						setCurrentDetailIndex({
							id: next_id,
							index: current_detail_index.index + 1,
							dimension_id: current_detail_index.dimension_id
						})
					}
				>
					<CaretDown size={16}></CaretDown>
				</div>
			</div>
			{item.id && (
				<div className='detail_item_wrap w_100 border_box flex flex_column'>
					<div
						className='todo_text_wrap w_100 border_box'
						contentEditable='plaintext-only'
						ref={input}
						onInput={onInput}
					></div>
					<div className='option_items w_100 border_box flex flex_column'>
						<div className='option_item w_100 border_box flex align_center'>
							<div className='name_wrap flex align_center'>
								<Tag size={16}></Tag>
								<span className='name'>{t('translation:common.tags.label')}</span>
							</div>
							<div className='value_wrap flex align_center'>
								<TagSelect
									className='tag_select'
									options={tags}
									value={tag_ids}
									useByDetail
									onChange={updateTags}
								></TagSelect>
							</div>
						</div>
						<div className='option_item w_100 border_box flex align_center'>
							<div className='name_wrap flex align_center'>
								<FireSimple size={16}></FireSimple>
								<span className='name'>{t('translation:todo.common.level')}</span>
							</div>
							<div className='value_wrap flex align_center'>
								<Level value={level} onChangeLevel={updateLevel}></Level>
							</div>
						</div>
						<div
							className={$cx(
								'option_item w_100 border_box flex align_center',
								item_status && 'disabled'
							)}
						>
							<div className='name_wrap flex align_center'>
								<Bell size={16}></Bell>
								<span className='name'>{t('translation:todo.Input.Remind.title')}</span>
							</div>
							<div className='value_wrap flex align_center'>
								<DateTime
									useByDetail
									value={remind_time}
									onChange={updateRemind}
								></DateTime>
							</div>
						</div>
						<div
							className={$cx(
								'option_item w_100 border_box flex align_center',
								item_status && 'disabled'
							)}
						>
							<div className='name_wrap flex align_center'>
								<Calendar size={16}></Calendar>
								<span className='name'>
									{t('translation:todo.Input.Deadline.title')}
								</span>
							</div>
							<div className='value_wrap flex align_center'>
								<DateTime
									useByDetail
									value={end_time}
									onChange={updateDeadline}
								></DateTime>
							</div>
						</div>
						<div
							className={$cx(
								'option_item w_100 border_box flex align_center',
								item_status && 'disabled'
							)}
						>
							<div className='name_wrap flex align_center'>
								<Repeat size={16}></Repeat>
								<span className='name'>{t('translation:todo.Input.Cycle.title')}</span>
							</div>
							<div className='value_wrap flex align_center'>
								<Cycle
									cycle_enabled={cycle_enabled}
									cycle={cycle}
									useByDetail
									onChange={updateCycle}
									onChangeItem={updateValues}
								></Cycle>
							</div>
						</div>
						<div
							className={$cx(
								'option_item schedule_wrap w_100 border_box flex align_center',
								item_status && 'disabled'
							)}
						>
							<div className='name_wrap flex align_center'>
								<Sun size={16}></Sun>
								<span className='name'>{t('translation:modules.schedule')}</span>
							</div>
							<div className='value_wrap border_box flex align_center'>
								<span
									className={$cx(
										'text cursor_point clickable',
										schedule && 'active'
									)}
									onClick={updateSchedule}
								>
									{schedule
										? t('translation:common.added')
										: t('translation:todo.Detail.add_to_shcedule')}
								</span>
								{schedule && (
									<span
										className='btn_remove none justify_center align_center clickable ml_12'
										onClick={updateSchedule}
									>
										<X size={7}></X>
									</span>
								)}
							</div>
						</div>
					</div>
					<div
						className={$cx(
							'detail_children_wrap w_100 border_box flex flex_column relative',
							item?.children?.length && 'has_children'
						)}
					>
						{!item?.children?.length ? (
							<div
								className='btn_insert w_100 border_box flex justify_center align_center clickable'
								// @ts-ignore
								onClick={insertChildren}
							>
								<Plus size={15}></Plus>
								<span className='text ml_6'>
									{t('translation:todo.context_menu.insert_children')}
								</span>
							</div>
						) : (
							<Children {...props_children}></Children>
						)}
					</div>
					<Remark remark={remark} updateRemark={updateRemark}></Remark>
				</div>
			)}
		</Drawer>
	)
}

export default $app.memo(Index)
