import { Drawer } from 'antd'
import { useTranslation } from 'react-i18next'

import type { IPropsList } from '../../types'

const Index = (props: IPropsList) => {
	const {
		visible_list_modal,
		list_duration,
		list_current_text,
		list_current_date,
		list_custom_duration,
		setListDuration,
		prev,
		next,
		setListCustomDuration,
		onClose
	} = props
	const { t } = useTranslation()

	return (
		<Drawer
			open={visible_list_modal}
			title={t('schedule.List.title')}
			width='min(624px,calc(100% - 24px))'
			destroyOnClose
			getContainer={false}
			footer={null}
			onClose={onClose}
		></Drawer>
	)
}

export default $app.memo(Index)
