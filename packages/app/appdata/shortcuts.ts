import type { Shortcuts } from '@/models'

export default [
	{
		name: $t('translation:shortcuts.global.app.toggleAppMenu'),
		key_bindings: 'shift+a',
		event_path: 'global.app.toggleAppMenu',
		readonly: false
	},
	{
		name: $t('translation:shortcuts.global.app.toggleAppSwitch'),
		key_bindings: 'shift+tab',
		event_path: 'global.app.appSwitch',
            readonly: true,
            options: { keydown: true, keyup: false }
	},
	{
		name: $t('translation:shortcuts.global.app.toggleAppSwitch'),
		key_bindings: '*',
		special_key: 'shift',
		event_path: 'global.app.handleAppSwitch',
            readonly: true,
            options: { keydown: false, keyup: true }
	}
] as Shortcuts['keys']
