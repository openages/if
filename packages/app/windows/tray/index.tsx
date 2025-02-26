import { ConfigProvider } from 'antd'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { container } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import { useSystemTheme, useTheme } from '@/hooks'
import { is_mac_electron } from '@/utils'

import styles from './index.css'

const Index = () => {
	const system_theme = useSystemTheme(true)
	const [global] = useState(() => container.resolve(GlobalModel))
	const theme = useTheme(system_theme, global.setting.color_main_rgb)

	return (
		<ConfigProvider theme={theme}>
			<If condition={is_mac_electron}>
				<style>{`html,body{background:transparent;}`}</style>
			</If>
			<div className={$cx('w_100 h_100', styles._local, is_mac_electron && styles.is_mac_electron)}></div>
		</ConfigProvider>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
