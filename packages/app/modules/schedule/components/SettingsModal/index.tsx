import { useMemoizedFn } from 'ahooks'
import { Form, Select } from 'antd'
import { useTranslation } from 'react-i18next'

import { SettingsModal, TagsEditor } from '@/components'
import { useArchiveOptions } from '@/hooks'

import TimelineAnglesEditor from '../TimelineAnglesEditor'
import styles from './index.css'

import type { IPropsSettingsModal } from '../../types'
import type { App } from '@/types'

const { Item } = Form

const Index = (props: IPropsSettingsModal) => {
	const {
		id,
		visible_settings_modal,
		setting,
		closeSettingsModal,
		updateSetting,
		removeTag,
		removeTimelineAngle,
		removeTimelineRow,
		cleanByTime
	} = props
	const { t } = useTranslation()
	const archive_options = useArchiveOptions()

	const props_settings_modal = {
		module: 'schedule' as App.ModuleType,
		className: styles._local,
		visible: visible_settings_modal,
		info: setting,
		IconEditCenter: true,
		getContainer: useMemoizedFn(() => document.getElementById(id)!),
		onClose: closeSettingsModal,
		onValuesChange: updateSetting
	}

	return (
		<SettingsModal {...props_settings_modal}>
			<div className='w_100 flex flex_column'>
				<Item name='tags' label={t('common.tags.label')}>
					<TagsEditor remove={removeTag}></TagsEditor>
				</Item>
				<Item name='timeline_angles' label={t('schedule.timeline_angles')}>
					<TimelineAnglesEditor
						removeTimelineAngle={removeTimelineAngle}
						removeTimelineRow={removeTimelineRow}
					></TimelineAnglesEditor>
				</Item>
				<Select
					className='archive_select'
					placeholder={t('common.clean.title')}
					suffixIcon={null}
					allowClear
					getPopupContainer={() => document.body}
					options={archive_options}
					onSelect={cleanByTime}
				></Select>
			</div>
		</SettingsModal>
	)
}

export default $app.memo(Index)
