import { observer } from 'mobx-react-lite'
import { useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { useGlobal } from '@/context/app'
import { mermaidRender } from '@/Editor/utils'
import { useCreateEffect, useSize } from '@/hooks'
import { Warning } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsRender } from '../types'

const Index = (props: IPropsRender) => {
	const { value, onClick } = props
	const ref = useRef(null)
	const global = useGlobal()
	const theme = global.setting.theme
	const width = useSize(() => ref.current!, 'width') as number

	useCreateEffect(() => {
		const el = ref.current

		if (!el || !value || !width) return

		mermaidRender(value, el, width)
	}, [value, width])

	useCreateEffect(() => {
		const el = ref.current

		if (!el || !value || !width) return

		let timer: NodeJS.Timer | null = null

		mermaidRender(value, el, width).then(() => {
			timer = setTimeout(() => {
				mermaidRender(value, el, width)
			}, 300)
		})

		return () => clearTimeout(timer!)
	}, [theme, width])

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
