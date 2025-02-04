import { useMemoizedFn } from 'ahooks'
import { Button, Form, Select } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { AnglesEditor, SettingsModal, TagsEditor } from '@/components'
import { TextEditor } from '@/Editor/components'
import { cleanTodoItems } from '@/modules/todo/services'

import styles from './index.css'

import type { IPropsSettingsModal } from '../../types'
import type { App } from '@/types'

const { Item } = Form

const Index = (props: IPropsSettingsModal) => {
	const { id, visible_settings_modal, setting, closeSettingsModal, updateSetting, removeAngle, removeTag } = props
	const { t, i18n } = useTranslation()

	const archive_options = useMemo(() => {
		const locale_options = t('todo.SettingsModal.auto_archiving.options') as Record<string, string>

		return Object.keys(locale_options).map(key => ({
			label: locale_options[key],
			value: key
		}))
	}, [i18n.language])

	const props_settings_modal = {
		module: 'todo' as App.ModuleType,
		className: styles._local,
		visible: visible_settings_modal,
		info: setting,
		getContainer: useMemoizedFn(() => document.getElementById(id)!),
		onClose: closeSettingsModal,
		onValuesChange: updateSetting
	}

	const onClean = useMemoizedFn(() => cleanTodoItems(id))

	return (
		<SettingsModal {...props_settings_modal}>
			<div className='w_100 flex flex_column'>
				<Item name='desc' label={t('todo.SettingsModal.desc.label')}>
					<TextEditor
						className='desc_textarea'
						placeholder_classname='desc_textarea_placeholder'
						placeholder={t('todo.SettingsModal.desc.placeholder')}
						max_length={150}
					></TextEditor>
				</Item>
				<Item name='angles' label={t('common.angles.label')}>
					<AnglesEditor remove={removeAngle}></AnglesEditor>
				</Item>
				<Item name='tags' label={t('common.tags.label')}>
					<TagsEditor remove={removeTag}></TagsEditor>
				</Item>
				<Item name='auto_archiving' label={t('todo.SettingsModal.auto_archiving.label')}>
					<Select options={archive_options}></Select>
				</Item>
				<Button className='btn_clean clickable' type='primary' danger onClick={onClean}>
					{t('common.clean.title_removed')}
				</Button>
			</div>
		</SettingsModal>
	)
}

export default $app.memo(Index)
