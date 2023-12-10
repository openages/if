import { Modal } from '@/components'
import { useTranslation } from 'react-i18next'
import { Form } from './components'
import styles from './index.css'

import type { HTMLAttributes, ReactNode } from 'react'

export interface IPropsSettingsModal {
	children: ReactNode
	visible: boolean
	info: any
	className?: HTMLAttributes<any>['className']
	onClose: () => void
	onValuesChange: (changedValues: any, values: any) => void
}

const Index = (props: IPropsSettingsModal) => {
	const { children, visible, info, className, onClose, onValuesChange } = props
	const { t } = useTranslation()

	return (
		<Modal
			className={$cx(styles._local, className)}
			title={`${t('translation:components.SettingsModal.edit')} ${info.name}`}
			open={visible}
			width={420}
			maskClosable
			onCancel={onClose}
		>
			<Form info={info} onValuesChange={onValuesChange}>
				{children}
			</Form>
		</Modal>
	)
}

export default $app.memo(Index)
