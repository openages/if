import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'

import { ModuleIcon } from '@/components'
import { useGlobal } from '@/context/app'
import { useLocale } from '@/hooks'

const Index = () => {
	const global = useGlobal()
	const l = useLocale()

	const onNavItem = useMemoizedFn((index) => {
		if (global.setting.nav_items[index].readonly) return

		global.setting.nav_items[index].checked = !global.setting.nav_items[index].checked
	})

	return (
		<Fragment>
			<span className='setting_title'>{l('setting.NavItems.title')}</span>
			<div className='setting_items w_100 border_box flex flex_column'>
				<div className='setting_item w_100 border_box flex justify_between flex_wrap'>
					{global.setting.nav_items.map((item, index) => (
						<div className='nav_item_wrap flex justify_center' key={item.title}>
							<div
								className={$cx(
									'nav_item flex flex_column align_center cursor_point',
									item.checked && 'checked',
									item.readonly ? 'readonly' : 'clickable'
								)}
								onClick={() => onNavItem(index)}
							>
								<ModuleIcon
									className='icon_bar'
									type={item.title}
									size={24}
									weight='bold'
									fill='inherit'
								></ModuleIcon>
								<span className='sidebar_item_title'>
									{l(`nav_title.${item.title}`)}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</Fragment>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
