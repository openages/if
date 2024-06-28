import { useTranslation } from 'react-i18next'

import Item from './Item'

import type { IPropsItems } from '../../types'

const Index = (props: IPropsItems) => {
	const { module, latest_items, search_mode, onItem } = props
	const { t } = useTranslation()

	return (
		<div className='latest_items_wrap border_box flex flex_column'>
			<If condition={!search_mode}>
				<span className='latest_title'>{t('translation:editor.Ref.latest_items')}</span>
			</If>
			<div className='flex flex_column'>
				{latest_items.map((item, index) => (
					<Item {...{ module, item, index, onItem }} key={index}></Item>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
