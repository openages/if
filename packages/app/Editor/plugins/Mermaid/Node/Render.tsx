import { useAsyncEffect } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { useGlobal } from '@/context/app'
import { mermaidRender } from '@/Editor/utils'
import { Warning } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsRender } from '../types'

const Index = (props: IPropsRender) => {
	const { value, onClick } = props
	const ref = useRef(null)
	const global = useGlobal()
	const theme = global.setting.theme

	useEffect(() => {
		const el = ref.current

		if (!el || !value) return

		mermaidRender(value, el)
	}, [value])

	useEffect(() => {
		const el = ref.current

		if (!el || !value) return

		let timer: NodeJS.Timeout = null

		mermaidRender(value, el).then(() => {
			timer = setTimeout(() => {
				mermaidRender(value, el)
			}, 300)
		})

		return () => clearTimeout(timer)
	}, [theme])

	return (
		<ErrorBoundary
			fallback={
				<div>
					<Warning size={18}></Warning>
				</div>
			}
		>
			<span
				className={$cx('w_100 border_box justify_center', styles.pre)}
				ref={ref}
				role='button'
				spellCheck={false}
				tabIndex={-1}
				onClick={onClick}
			/>
		</ErrorBoundary>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
