import { useMemoizedFn } from 'ahooks'
import { Drawer, Tooltip } from 'antd'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { todo } from '@/appdata'
import { Modal } from '@/components'
import { useStackSelector } from '@/context/stack'
import { useText, useTextChange, Text } from '@/Editor'
import { getItemStatus } from '@/utils/modules/todo'
import {
	ArrowsOutSimple,
	Bell,
	BoxArrowDown,
	Calendar,
	CaretDown,
	CaretUp,
	FireSimple,
	Plus,
	Repeat,
	SignIn,
	SignOut,
	Sun,
	Tag,
	X
} from '@phosphor-icons/react'

import Children from '../Children'
import Cycle from '../Cycle'
import DateTime from '../DateTime'
import Level from '../Level'
import Remark from '../Remark'
import TagSelect from '../TagSelect'
import { useHandlers } from '../TodoItem/hooks'
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
	const [visible_remark_modal, setVisibleRemarkModal] = useState(false)
	const container_id = useStackSelector(v => v.id)
	const { item = {} as Todo.Todo, prev_id, next_id } = current_detail_item
	const { index, dimension_id } = current_detail_index

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

	const { ref_editor, onChange, setEditor, setRef } = useText({
		update: v => update({ type: 'parent', index, dimension_id, value: { text: v } })
	})

	useTextChange({ ref_editor, text })

	const {
		updateValues,
		updateTags,
		updateLevel,
		updateRemind,
		updateDeadline,
		updateCycle,
		updateSchedule,
		updateRemark,
		insertChildren
	} = useHandlers({
		item,
		index,
		kanban_mode,
		dimension_id,
		update
	})

	const item_status = useMemo(() => getItemStatus({ relations, id, status }), [relations, id, status])

	const close = useMemoizedFn(() => {
		update({ type: 'close', index, dimension_id, value: {} })
	})

	const unclose = useMemoizedFn(() => {
		update({ type: 'unclose', index, dimension_id, value: {} })
	})

	const archive = useMemoizedFn(() => {
		update({ type: 'archive', index, dimension_id, value: {} })
	})

	const prev = useMemoizedFn(() => {
		setCurrentDetailIndex({
			id: prev_id,
			index: index - 1,
			dimension_id
		})
	})

	const next = useMemoizedFn(() => {
		setCurrentDetailIndex({
			id: next_id,
			index: index + 1,
			dimension_id
		})
	})

	const props_children: IPropsChildren = {
		mode,
		kanban_mode,
		items: children,
		index,
		open: true,
		isDragging: false,
		useByDetail: true,
		handled: status === 'checked' || status === 'closed',
		dimension_id,
		update,
		tab
	}

	const props_remark_modal = {
		bodyClassName: styles.modal,
		open: visible_remark_modal,
		title: t('translation:todo.Detail.remark.title'),
		width: 540,
		minHeight: '72vh',
		onCancel: useMemoizedFn(() => setVisibleRemarkModal(false)),
		getContainer: useMemoizedFn(() => document.getElementById(container_id))
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
			width={300}
			zIndex={100}
			destroyOnClose
			getContainer={false}
			onClose={closeDetailModal}
			afterOpenChange={clearCurrentDetail}
		>
			<div className='actions_wrap flex absolute'>
				<If condition={status === 'unchecked'}>
					<Tooltip title={t('translation:todo.common.close')} destroyTooltipOnHide>
						<div
							className={$cx('btn_action flex justify_center align_center clickable mr_6')}
							onClick={close}
						>
							<SignIn size={14}></SignIn>
						</div>
					</Tooltip>
				</If>
				<If condition={status === 'closed'}>
					<Tooltip title={t('translation:todo.common.unclose')} destroyTooltipOnHide>
						<div
							className={$cx('btn_action flex justify_center align_center clickable mr_6')}
							onClick={unclose}
						>
							<SignOut size={14}></SignOut>
						</div>
					</Tooltip>
				</If>
				<Tooltip title={t('translation:todo.Header.options.archive')} destroyTooltipOnHide>
					<If condition={status === 'checked' || status === 'closed'}>
						<div
							className={$cx('btn_action flex justify_center align_center clickable mr_6')}
							onClick={archive}
						>
							<BoxArrowDown size={14}></BoxArrowDown>
						</div>
					</If>
				</Tooltip>
				<div
					className={$cx(
						'btn_action flex justify_center align_center clickable mr_6',
						!prev_id && 'disabled'
					)}
					onClick={prev}
				>
					<CaretUp size={16}></CaretUp>
				</div>
				<div
					className={$cx(
						'btn_action flex justify_center align_center clickable',
						!current_detail_item.next_id && 'disabled'
					)}
					onClick={next}
				>
					<CaretDown size={16}></CaretDown>
				</div>
			</div>
			{item.id && (
				<div className='detail_item_wrap w_100 border_box flex flex_column'>
					<Text
						className='todo_text_wrap w_100 border_box'
						max_length={todo.text_max_length}
						onChange={onChange}
						setEditor={setEditor}
						setRef={setRef}
					></Text>
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
					<Modal {...props_remark_modal}>
						<Remark remark={remark} in_modal updateRemark={updateRemark}></Remark>
					</Modal>
					<div className='remark_wrap w_100 relative'>
						<div
							className='btn_remark_modal absolute flex z_index_10 justify_center align_center clickable cursor_point'
							onClick={() => setVisibleRemarkModal(true)}
						>
							<ArrowsOutSimple></ArrowsOutSimple>
						</div>
						<If condition={!visible_remark_modal}>
							<Remark remark={remark} updateRemark={updateRemark}></Remark>
						</If>
					</div>
				</div>
			)}
		</Drawer>
	)
}

export default $app.memo(Index)
