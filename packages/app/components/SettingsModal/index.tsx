import { Modal } from 'antd'
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
			rootClassName={$cx(styles._local, className)}
			open={visible}
			title={`${t('translation:components.SettingsModal.edit')} ${info.name}`}
			width={450}
			centered
			destroyOnClose
			getContainer={false}
			maskClosable={false}
			onCancel={onClose}
			footer={null}
		>
			<Form info={info} onValuesChange={onValuesChange}>
				{children}
			</Form>
		</Modal>
	)
}

export default $app.memo(Index)
