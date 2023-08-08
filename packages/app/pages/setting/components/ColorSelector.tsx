import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'

import { color_mains } from '@/appdata'
import { useGlobal } from '@/context/app'
import { useLocale } from '@/hooks'

const Index = () => {
	const global = useGlobal()
	const l = useLocale()

	const onItem = useMemoizedFn((color: string) => global.setting.setColorMain(color))

	return (
		<Fragment>
			<span className='setting_title'>{l('setting.ColorSelector.title')}</span>
			<div className='setting_items w_100 border_box flex flex_column'>
				<div className='setting_item w_100 border_box flex align_center justify_between'>
					{color_mains.map((item) => (
						<div
							className={$cx(
								'color_item_wrap flex justify_center align_center cursor_point',
								item === global.setting.color_main && 'active'
							)}
							onClick={() => onItem(item)}
							key={item}
						>
							<span
								className='color_item w_100 h_100'
								style={{ backgroundColor: item }}
							></span>
						</div>
					))}
				</div>
			</div>
		</Fragment>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
