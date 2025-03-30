import { useMemoizedFn } from 'ahooks'
import { useTranslation } from 'react-i18next'

import type { IPropsAppsItem } from '../../types'
import type { App } from '@/types'

const Index = (props: IPropsAppsItem) => {
	const { item } = props
	const { id, text, Icon, color, event, args } = item
	const { t } = useTranslation()

	const onClick = useMemoizedFn(() => {
		$app.Event.emit(event, args || id)
	})

	return (
		<div
			className='app_item w_100 h_100 border_box flex flex_column align_center justify_center clickable'
			onClick={onClick}
		>
			<div className='icon_wrap border_box flex justify_center align_center'>
				<Icon size='100%' weight='fill' color={color}></Icon>
			</div>
			<span className='item_name'>{text ? t(text as any) : t(`modules.${id as App.ModuleType}`)}</span>
		</div>
	)
}

export default $app.memo(Index)
