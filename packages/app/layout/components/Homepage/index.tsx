import { useTranslation } from 'react-i18next'

import bg_homepage from '@/public/images/bg_homepage_0.jpg'
import { is_win_electron } from '@/utils'
import { MagnifyingGlass } from '@phosphor-icons/react'

import WinActions from '../WinActions'
import styles from './index.css'

import type { IPropsHomePage } from '@/layout/types'
import type { App } from '@/types'

const Index = (props: IPropsHomePage) => {
	const { apps } = props
	const { t } = useTranslation()

	return (
		<div className={$cx('w_100 h_100 border_box flex flex_column relative', styles._local)}>
			<div className='drag_handler is_drag w_100 absolute z_index_10 top_0 left_0 flex justify_end'>
				<If condition={is_win_electron}>
					<WinActions></WinActions>
				</If>
			</div>
			<div className='bg w_100 h_100 absolute' style={{ backgroundImage: `url(${bg_homepage})` }}></div>
			<div className='mask w_100 h_100 absolute'></div>
			<div className='content_wrap w_100 h_100 border_box flex flex_column absolute'>
				<div className='search_wrap w_100 flex justify_center'>
					<div className='input_search_wrap border_box flex align_center relative'>
						<MagnifyingGlass className='icon_search absolute'></MagnifyingGlass>
						<input
							className='input_search w_100 h_100 border_box'
							type='text'
							placeholder='输入并搜索'
						/>
					</div>
				</div>
				<div className='app_items_wrap w_100 border_box'>
					<div className='app_items w_100 h_100 border_box flex flex_wrap'>
						{apps.map(({ id, text, Icon, color }) => (
							<div
								className='app_item w_100 h_100 border_box flex flex_column align_center justify_center clickable'
								key={id}
							>
								<div className='icon_wrap border_box flex justify_center align_center'>
									<Icon size='100%' weight='fill' color={color}></Icon>
								</div>
								<span className='item_name'>
									{text ? t(text as any) : t(`modules.${id as App.ModuleType}`)}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
