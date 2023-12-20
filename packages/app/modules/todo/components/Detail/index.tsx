import { useMemoizedFn } from 'ahooks'
import { Drawer } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Bell, CaretDown, CaretUp, HourglassMedium, Plus, Star as StarIcon, Tag } from '@phosphor-icons/react'

import { useInput } from '../../hooks'
import Children from '../Children'
import Cycle from '../Cycle'
import Remind from '../Remind'
import Star from '../Star'
import TagSelect from '../TagSelect'
import { useContextMenu, useHandlers } from '../TodoItem/hooks'
import Remark from './components/Remark'

import styles from './index.css'

import type { Todo } from '@/types'
import type { IPropsChildren, IPropsDetail } from '../../types'

const Index = (props: IPropsDetail) => {
	const {
		breakpoint,
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
	const { status, text, children, tag_ids, star, remind_time, cycle_enabled, cycle, recycle_time, remark } = item

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

	const { insertChildren, removeChildren, updateTags, updateStar, updateRemind, updateCircle, updateRemark } =
		useHandlers({
			item,
			index: current_detail_index.index,
			dimension_id: current_detail_index.dimension_id,
			visible_detail_modal,
			update
		})

	const { ChildrenContextMenu } = useContextMenu({})

	const exist_relations = useMemo(() => {
		if (!item.id || !relations.length) return false

		return relations.find(it => it.items.includes(item.id))
	}, [relations, current_detail_item])

	const props_children: IPropsChildren = {
		items: children,
		index: current_detail_index.index,
		fold: false,
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
				styles._local,
				breakpoint && styles.breakpoint,
				breakpoint === 390 && styles.narrow_390
			)}
			open={visible_detail_modal}
			title={t('translation:todo.Detail.title')}
			width={342}
			mask={Boolean(breakpoint)}
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
							index: current_detail_index.index - 1
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
							index: current_detail_index.index + 1
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
								<span className='name'>
									{t('translation:todo.SettingsModal.tags.label')}
								</span>
							</div>
							<TagSelect
								options={tags}
								value={tag_ids}
								useByDetail
								onChange={updateTags}
							></TagSelect>
						</div>
						<div className='option_item w_100 border_box flex align_center'>
							<div className='name_wrap flex align_center'>
								<StarIcon size={16}></StarIcon>
								<span className='name'>{t('translation:todo.common.star')}</span>
							</div>
							<Star value={star} onChangeStar={updateStar}></Star>
						</div>
						<div
							className={$cx(
								'option_item w_100 border_box flex align_center',
								status === 'checked' && 'disabled'
							)}
						>
							<div className='name_wrap flex align_center'>
								<Bell size={16}></Bell>
								<span className='name'>{t('translation:todo.Input.Remind.title')}</span>
							</div>
							<Remind
								remind_time={remind_time}
								useByDetail
								onChangeRemind={updateRemind}
							></Remind>
						</div>
						<div
							className={$cx(
								'option_item w_100 border_box flex align_center',
								(exist_relations || (recycle_time && status === 'checked')) &&
									'disabled'
							)}
						>
							<div className='name_wrap flex align_center'>
								<HourglassMedium size={16}></HourglassMedium>
								<span className='name'>{t('translation:todo.Input.Cycle.title')}</span>
							</div>
							<Cycle
								cycle_enabled={cycle_enabled}
								cycle={cycle}
								useByDetail
								onChangeCircle={updateCircle}
							></Cycle>
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
