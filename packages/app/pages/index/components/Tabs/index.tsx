import { Tooltip } from 'antd'

import { ArchiveBox } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsTabs } from '../../types'

const Index = (props: IPropsTabs) => {
	const { tabs, active_tab_index, setActiveTabIndex } = props

	return (
		<div className={$cx('w_100 sticky top_0 z_index_10', styles._local)}>
			<div className='tabs_wrap limited_content_wrap flex align_center relative'>
				<div className='tab_items_wrap flex'>
					{tabs.map((item, index) => (
						<div
							className={$cx(
								'tab_item_wrap border_box flex justify_center align_center cursor_point transition_normal',
								active_tab_index === index && 'active'
							)}
							onMouseDown={() => setActiveTabIndex(index)}
							key={item}
						>
							<span className='tab_name transition_normal'>{item}</span>
						</div>
					))}
				</div>
				<Tooltip title='归档' placement='right'>
					<div className='right_icon_wrap border_box flex justify_center align_center cursor_point clickable absolute'>
						<ArchiveBox size={18}></ArchiveBox>
					</div>
				</Tooltip>
			</div>
		</div>
	)
}

export default $app.memo(Index)
