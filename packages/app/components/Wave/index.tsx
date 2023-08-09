import { ConfigProvider } from 'antd'

import { waveEffect } from './utils'

import type { ReactNode } from 'react'

export type WaveConfig = NonNullable<Parameters<typeof ConfigProvider>[0]['wave']>

interface IProps extends WaveConfig {
	children: ReactNode
}

const Index = (props: IProps & WaveConfig) => {
	const { children } = props

	return <ConfigProvider wave={{ showEffect: waveEffect }}>{children}</ConfigProvider>
}

export default $app.memo(Index)
