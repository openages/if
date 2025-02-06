import { observer } from 'mobx-react-lite'

import { useGlobal } from '@/context/app'
import { FireSimple, Lightning } from '@phosphor-icons/react'

import QuadTodos from '../QuadTodos'
import styles from './index.css'

import type { IPropsQuad } from '../../types'

const Index = (props: IPropsQuad) => {
	const {
		mode,
		open_items,
		zen_mode,
		quad_items,
		tags,
		angles,
		relations,
		drag_disabled,
		check,
		updateRelations,
		insert,
		update,
		tab,
		moveTo,
		remove,
		handleOpenItem,
		showDetailModal
	} = props
	const global = useGlobal()
	const unpaid = !global.auth.is_paid_user

	return (
		<div className={$cx('w_100 border_box', styles.wrap)}>
			<div
				className={$cx(
					'h_100 border_box flex juctify_center align_center relative',
					styles._local,
					unpaid && styles.unpaid
				)}
			>
				<div className='x_line_wrap flex align_center absolute'>
					<div className='label_wrap flex align_center'>
						<Lightning className='icon' weight='fill'></Lightning>
						<span className='label'>URGENCY</span>
					</div>
					<div className='x_line'></div>
				</div>
				<div className='y_line_wrap flex flex_column align_center absolute'>
					<div className='label_wrap flex flex_column align_center'>
						<FireSimple className='icon' weight='fill'></FireSimple>
						<span className='label'>IMPORTANT</span>
					</div>
					<div className='y_line'></div>
				</div>
				{Object.keys(quad_items).map(level => {
					const items = quad_items[level]

					return (
						<div
							className={$cx(
								'border_box flex flex_column',
								styles.kanban_item_wrap,
								styles[level]
							)}
							key={level}
						>
							<QuadTodos
								{...{
									mode,
									tags,
									angles,
									relations,
									drag_disabled,
									open_items,
									zen_mode,
									check,
									updateRelations,
									insert,
									update,
									tab,
									moveTo,
									remove,
									handleOpenItem,
									showDetailModal
								}}
								items={items}
								dimension_id={level}
							></QuadTodos>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
