import { Drawer } from 'antd'
import { useTranslation } from 'react-i18next'

import { TodoActivity } from '@/atoms'

import type { IPropsActivity } from '../../types'

const Index = (props: IPropsActivity) => {
	const { id, visible_activity_modal, onClose } = props
	const { t } = useTranslation()

	return (
		<Drawer
			open={visible_activity_modal}
			title={t('atoms.TodoActivity.title')}
			width='min(624px,calc(100% - 24px))'
			destroyOnClose
			getContainer={false}
			footer={null}
			onClose={onClose}
		>
			<TodoActivity id={id}></TodoActivity>
		</Drawer>
	)
}

export default $app.memo(Index)
