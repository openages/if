import { Button } from 'antd'
import { Fragment } from 'react'
import { useOutlet, NavLink } from 'react-router-dom'

import { Wave } from '@/components'
import { Sliders, Layout, Activity } from '@phosphor-icons/react'

import styles from './index.css'

const nav_items = [
	{
		name: '全局设置',
		icon: Sliders,
		pathname: '/setting'
	},
	{
		name: '应用设置',
		icon: Layout,
		pathname: '/setting/apps'
	},
	{
		name: '任务管理器',
		icon: Activity,
		pathname: '/setting/task_center'
	}
]

const Index = () => {
	const outlet = useOutlet()

	return (
		<Fragment>
			<div className={$cx('limited_unchanged_content_wrap sticky top_0', styles.nav_menu)}>
				<div className='menu_items w_100 border_box flex justify_between'>
					{nav_items.map((item) => (
						<Wave key={item.name}>
							<Button className='menu_item_wrap'>
								<NavLink
									className='menu_item w_100 border_box flex flex_column align_center'
									to={item.pathname}
								>
									<item.icon size={24}></item.icon>
									<span className='menu_name mt_6 font_bold'>{item.name}</span>
								</NavLink>
							</Button>
						</Wave>
					))}
				</div>
			</div>
			<div className='w_100'>{outlet}</div>
		</Fragment>
	)
}

export default $app.memo(Index)
