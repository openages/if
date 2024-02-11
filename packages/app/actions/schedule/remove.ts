import { confirm } from '@/utils/antd'

import type { Extend } from '@/types'

const Index = async (focusing_item: Extend.DirTree.TransformedItem, changeMode?: boolean) => {
	const file_id = focusing_item.id

	const counts = await $db.schedule_items.count({ selector: { file_id } }).exec()

	if (counts > 0) {
		const res = await confirm({
			id: file_id,
			title: $t('translation:common.notice'),
			content: changeMode
				? $t('translation:schedule.change_mode_confirm')
				: // @ts-ignore
				  '' + $t('translation:common.clean.confirm', { counts })
		})

		if (!res) return false
	}

	if (!changeMode) {
		await $db.module_setting.findOne({ selector: { file_id } }).remove()
	}

	await $db.schedule_items.find({ selector: { file_id } }).remove()
}

export default Index
