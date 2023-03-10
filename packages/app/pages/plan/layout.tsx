import { Segmented } from 'antd'
import { Fragment, useMemo } from 'react'

import { plan_items } from '@/appdata'
import { ModuleIcon } from '@/components'
import { useLocale } from '@/hooks'
import { Outlet, useLocation, useNavigate } from '@umijs/max'

import styles from './index.css'

const Index = () => {
	const l = useLocale()
	const { pathname } = useLocation()
	const push = useNavigate()

	const options = useMemo(
		() =>
			plan_items.map((item) => ({
				label: (
					<div className='nav_item_wrap flex align_center relative' key={item.title}>
						<ModuleIcon className='icon_bar mr_2' type={item.title} size={16}></ModuleIcon>
						<span className='title'>{l(`nav_title.${item.title}`)}</span>
					</div>
				),
				value: item.path
			})),
		[]
	)

	return (
		<Fragment>
			<div className={$cx('border_box flex justify_center fixed z_index_1000', styles._local)}>
				<Segmented
					className='nav_items'
					size='small'
					options={options}
					value={pathname}
					onChange={(v) => push(v as string)}
				></Segmented>
			</div>
			<Outlet></Outlet>
		</Fragment>
	)
}

export default $app.memo(Index)
