import { App } from '@/types'

export default ['todo', 'note', 'schedule'] as Array<App.ModuleType>

export const options_search_type = [
	{ label: $t('translation:common.item'), value: 'item' },
	{ label: $t('translation:common.file'), value: 'file' }
]
