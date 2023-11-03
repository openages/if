import { Drawer } from 'antd'
import { useTranslation } from 'react-i18next'

import { Tag, BellRinging, HourglassMedium, CaretUp, CaretDown } from '@phosphor-icons/react'

import Children from '../Children'
import Circle from '../Input/Circle'
import Star from '../Input/Star'
import TagSelect from '../TagSelect'
import { useInput, useHandlers, useContextMenu } from '../TodoItem/hooks'
import styles from './index.css'

import type { IPropsDetail, IPropsChildren } from '../../types'

const Index = (props: IPropsDetail) => {
	const {
		visible_detail_modal,
		current_detail_index,
		current_detail_item,
		tags,
		next,
		update,
		tab,
		closeDetailModal,
		clearCurrentDetail,
		setCurrentDetailIndex
	} = props
	const { t } = useTranslation()
	const { status, children, tag_ids, star, circle_enabled, circle_value } = current_detail_item
	const { input, onInput } = useInput({
		item: current_detail_item,
		index: current_detail_index,
		update
	})
	const { insertChildren, removeChildren, updateTags, updateStar, updateCircle } = useHandlers({
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
			rootClassName={$cx('hide_mask custom', styles._local)}
			open={visible_detail_modal}
			title={t('translation:todo.Detail.title')}
			width={360}
			mask={false}
			destroyOnClose
			getContainer={false}
			onClose={closeDetailModal}
			afterOpenChange={clearCurrentDetail}
		>
			<div className='toggle_wrap flex absolute'>
				<div
					className={$cx(
						'btn_toggle flex justify_center align_center clickable mr_6',
						current_detail_index === 0 && 'disabled'
					)}
					onClick={() => setCurrentDetailIndex(current_detail_index - 1)}
				>
					<CaretUp size={16}></CaretUp>
				</div>
				<div
					className={$cx(
						'btn_toggle flex justify_center align_center clickable',
						!next && 'disabled'
					)}
					onClick={() => setCurrentDetailIndex(current_detail_index + 1)}
				>
					<CaretDown size={16}></CaretDown>
				</div>
			</div>
			{current_detail_item.id && (
				<div className='detail_item_wrap w_100 border_box flex flex_column'>
					<div className='todo_text_wrap w_100' ref={input} contentEditable onInput={onInput}></div>
					<div className='option_items w_100 border_box flex flex_column mb_12'>
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
								<BellRinging size={16}></BellRinging>
								<span className='name'>{t('translation:todo.common.star')}</span>
							</div>
							<Star value={star} onChangeStar={updateStar}></Star>
						</div>
						<div className='option_item w_100 border_box flex align_center'>
							<div className='name_wrap flex align_center'>
								<HourglassMedium size={16}></HourglassMedium>
								<span className='name'>{t('translation:todo.Input.Circle.title')}</span>
							</div>
							<Circle
								circle_enabled={circle_enabled}
								circle_value={circle_value}
								useByDetail
								onChangeCircle={updateCircle}
							></Circle>
						</div>
					</div>
					{current_detail_item.children && <Children {...props_children}></Children>}
				</div>
			)}
		</Drawer>
	)
}

export default $app.memo(Index)
