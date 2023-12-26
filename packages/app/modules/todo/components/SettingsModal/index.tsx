import { Form, Input, Select } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { SettingsModal } from '@/components'
import { useLimits } from '@/hooks'

import { AnglesEditor, TagsEditor } from './components'
import styles from './index.css'

import type { IPropsSettingsModal } from '../../types'

const { Item } = Form
const { TextArea } = Input

const Index = (props: IPropsSettingsModal) => {
	const { visible_settings_modal, setting, closeSettingsModal, updateSetting, removeAngle, removeTag } = props
	const limits = useLimits()
	const { t, i18n } = useTranslation()

	const auto_archiving_options = useMemo(() => {
		// @ts-ignore
		const locale_options = t('translation:todo.SettingsModal.auto_archiving.options', {
			returnObjects: true
		}) as Record<string, string>

		return Object.keys(locale_options).map(key => ({
			label: locale_options[key],
			value: key
		}))
	}, [i18n.language])

	const props_settings_modal = {
		className: styles._local,
		visible: visible_settings_modal,
		info: setting,
		onClose: closeSettingsModal,
		onValuesChange: updateSetting
	}

	return (
		<SettingsModal {...props_settings_modal}>
			<div className='w_100 flex flex_column'>
				<Item name='desc' label={t('translation:todo.SettingsModal.desc.label')}>
					<TextArea
						className='desc_textarea'
						placeholder={t('translation:todo.SettingsModal.desc.placeholder')}
						rows={3}
						showCount
						maxLength={limits.todo_list_desc_max_length}
					></TextArea>
				</Item>
				<Item name='angles' label={t('translation:todo.SettingsModal.angles.label')}>
					<AnglesEditor remove={removeAngle}></AnglesEditor>
				</Item>
				<Item name='tags' label={t('translation:todo.SettingsModal.tags.label')}>
					<TagsEditor remove={removeTag}></TagsEditor>
				</Item>
				<Item name='auto_archiving' label={t('translation:todo.SettingsModal.auto_archiving.label')}>
					<Select options={auto_archiving_options}></Select>
				</Item>
			</div>
		</SettingsModal>
	)
}

export default $app.memo(Index)
