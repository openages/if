import { useMemoizedFn } from 'ahooks'
import Color from 'color'
import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { color_mains } from '@/appdata'
import { useGlobal } from '@/context/app'

const Index = () => {
	const global = useGlobal()
	const { t } = useTranslation()

	const onItem = useMemoizedFn((color: string) => global.setting.setColorMain(Color(color).rgb().array().join(',')))

	return (
		<Fragment>
			<span className='setting_title'>{t('translation:setting.ColorSelector.title')}</span>
			<div className='setting_items w_100 border_box flex flex_column'>
				<div className='setting_item w_100 border_box flex align_center justify_between'>
					{color_mains.map(item => (
						<div
							className={$cx(
								'color_item_wrap border_box flex justify_center align_center cursor_point',
								item === Color.rgb(`rgb(${global.setting.color_main_rgb})`).hex() &&
									'active'
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
