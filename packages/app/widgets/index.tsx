import { ConfigProvider } from 'antd'
import { observer } from 'mobx-react-lite'
import { lazy, useMemo, useState, Suspense } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { container } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import { useSystemTheme, useTheme } from '@/hooks'
import { is_mac_electron } from '@/utils'

import styles from './index.css'

const Index = () => {
	const { type } = useParams()
	const [params] = useSearchParams()
	const system_theme = useSystemTheme(true)
	const [global] = useState(() => container.resolve(GlobalModel))
	const theme = useTheme(system_theme, global.setting.color_main_rgb)

	const Component = useMemo(() => {
		return lazy(() => import(`./${type}`))
	}, [type])

	const props = useMemo(() => Object.fromEntries(params), [params])

	return (
		<ConfigProvider theme={theme}>
			<If condition={is_mac_electron}>
				<style>{`html,body{background:transparent;}`}</style>
			</If>
			<div
				className={$cx(
					'w_100 h_100vh flex flex_column',
					styles._local,
					is_mac_electron && styles.is_mac_electron
				)}
			>
				<Suspense fallback={null}>
					<Component {...props} />
				</Suspense>
			</div>
		</ConfigProvider>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
