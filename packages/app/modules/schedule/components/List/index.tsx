import { Drawer } from 'antd'
import { useTranslation } from 'react-i18next'

import { Header, Items } from './components'

import type { IPropsList, IPropsListHeader, IPropsListItems } from '../../types'

const Index = (props: IPropsList) => {
	const {
		visible_list_modal,
		list_duration,
		list_current_text,
		list_custom_duration,
		list_items,
		tags,
		setListDuration,
		prev,
		next,
		setListCustomDuration,
		jump,
		onClose
	} = props
	const { t } = useTranslation()

	const props_header: IPropsListHeader = {
		list_duration,
		list_current_text,
		list_custom_duration,
		total: list_items.length,
		setListDuration,
		prev,
		next,
		setListCustomDuration
	}

	const props_items: IPropsListItems = {
		list_items,
		tags,
		jump
	}

	return (
		<Drawer
			open={visible_list_modal}
			title={t('schedule.List.title')}
			width='min(624px,calc(100% - 24px))'
			destroyOnClose
			getContainer={false}
			footer={null}
			onClose={onClose}
		>
			<Header {...props_header}></Header>
			<Items {...props_items}></Items>
		</Drawer>
	)
}

export default $app.memo(Index)
