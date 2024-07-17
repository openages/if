import { useTranslation } from 'react-i18next'

import { Modal } from '@/components'

import { Form } from './components'
import styles from './index.css'

import type { HTMLAttributes, ReactNode } from 'react'
import type { App } from '@/types'

export interface IPropsSettingsModal {
	module: App.ModuleType
	children: ReactNode
	visible: boolean
	info: any
	className?: HTMLAttributes<any>['className']
	IconEditCenter?: boolean
	getContainer?: () => Element
	onClose: () => void
	onValuesChange: (changedValues: any, values: any) => void
}

const Index = (props: IPropsSettingsModal) => {
	const { module, children, visible, info, className, IconEditCenter, getContainer, onClose, onValuesChange } =
		props
	const { t } = useTranslation()

	return (
		<Modal
			className={$cx(styles._local, className)}
			title={`${t('translation:components.SettingsModal.edit')} ${info.name}`}
			open={visible}
			width={420}
			maskClosable
			getContainer={getContainer}
			onCancel={onClose}
		>
			<Form module={module} info={info} IconEditCenter={IconEditCenter} onValuesChange={onValuesChange}>
				{children}
			</Form>
		</Modal>
	)
}

export default $app.memo(Index)
