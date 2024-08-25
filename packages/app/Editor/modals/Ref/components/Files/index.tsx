import { useTranslation } from 'react-i18next'

import Item from './Item'

import type { IPropsFiles } from '../../types'

const Index = (props: IPropsFiles) => {
	const { module, latest_files, search_mode, onItem } = props
	const { t } = useTranslation()

	return (
		<div className='latest_items_wrap border_box flex flex_column'>
			<If condition={!search_mode}>
				<span className='latest_title'>{t('editor.Ref.latest_files')}</span>
			</If>
			<div className='flex flex_column'>
				{latest_files.map((item, index) => (
					<Item {...{ module, item, index, onItem }} key={index}></Item>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
