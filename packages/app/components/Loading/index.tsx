import { useTranslation } from 'react-i18next'

import { Logo } from '@/components'
import { local } from '@openages/stk/storage'

import styles from './index.css'

interface IProps {
	className?: string
	size?: number
	desc?: string
	useByComponent?: boolean
	close_text?: string
	close?: () => void
}

const Index = (props: IProps) => {
	const { className, size = 96, desc, useByComponent, close_text, close } = props
	const { t } = useTranslation()

	return (
		<div
			className={$cx(
				'flex flex_column justify_center align_center',
				!useByComponent && 'w_100vw h_100vh fixed top_0 left_0',
				styles._local,
				styles[local.theme],
				useByComponent && styles.useByComponent,
				className
			)}
			style={{ '--loading_size': size + 'px' }}
		>
			<div className='loading_wrap relative'>
				<Logo
					className='loading_icon bottom w_100 h_100 absolute top_0 left_0'
					size={size}
					color='inherit'
				></Logo>
				<Logo
					className='loading_icon top w_100 h_100 absolute top_0 left_0'
					size={size}
					color='inherit'
				></Logo>
			</div>
			{desc && <span className='desc border_box text_center'>{desc}</span>}
			<If condition={!!close}>
				<button className='btn_close flex justify_center align_center mt_12 clickable' onClick={close}>
					{close_text ?? t('todo.common.close')}
				</button>
			</If>
		</div>
	)
}

export default Index
