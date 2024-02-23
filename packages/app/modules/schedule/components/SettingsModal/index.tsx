import { Form } from 'antd'
import { useTranslation } from 'react-i18next'

import { SettingsModal, TagsEditor } from '@/components'

import styles from './index.css'

import type { IPropsSettingsModal } from '../../types'

const { Item } = Form

const Index = (props: IPropsSettingsModal) => {
	const { visible_settings_modal, setting, closeSettingsModal, updateSetting, removeTag } = props
	const { t } = useTranslation()

	const props_settings_modal = {
		className: styles._local,
		visible: visible_settings_modal,
		info: setting,
		IconEditCenter: true,
		onClose: closeSettingsModal,
		onValuesChange: updateSetting
	}

	return (
		<SettingsModal {...props_settings_modal}>
			<div className='w_100 flex flex_column'>
				<Item name='tags' label={t('translation:common.tags.label')}>
					<TagsEditor remove={removeTag}></TagsEditor>
				</Item>
			</div>
		</SettingsModal>
	)
}

export default $app.memo(Index)
