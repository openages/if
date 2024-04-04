import { omit } from 'lodash-es'

import { updateSetting as updateSettingAction } from '@/actions/global'
import { Auth } from '@/types'
import { confirm } from '@/utils/antd'
import { local } from '@openages/stk/storage'

import type { File } from '@/models'
import type { App } from '@/types'

export const auth = async (module: App.ModuleType) => {
	const user_type = local.user_type as Auth.UserType

	if (module === 'note') return true
	if (user_type !== Auth.UserTypes.trial) return true

	const counts = await $db.dirtree_items.count({ selector: { module, type: 'file' } }).exec()

	if (counts === 0) return true

	const res = await confirm({
		title: $t('translation:common.notice'),
		content: $t('translation:app.auth.confirm')
	})

	if (!res) return false

	$app.Event.emit('global.auth.showVisiblePayModal')

	return false
}

export const getQuerySetting = (file_id: string) => {
	return $db.module_setting.findOne({ selector: { file_id } })
}

export const updateSetting = async (args: {
	file_id: string
	setting: App.ModuleSetting
	changed_values: Partial<App.ModuleSetting & File['data']> & { icon_info: { icon: string; icon_hue?: number } }
	values: App.ModuleSetting & File['data']
}) => {
	const { file_id, setting, changed_values, values } = args

	if (changed_values.name || changed_values.icon_info) {
		await $app.Event.emit('todo/dirtree/update', {
			id: file_id,
			...(changed_values.icon_info ?? changed_values)
		})
	} else {
		const target_setting = $copy(setting)

		target_setting.setting = { ...target_setting.setting, ...omit(values, 'icon_info') }

		await updateSettingAction(file_id, target_setting.setting)
	}
}
