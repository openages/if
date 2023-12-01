import type { Shortcuts } from '@/models'

export default ([
	{
		key_bindings: 'shift+a',
		event_path: 'global.app.toggleAppMenu',
		readonly: false
	},
	{
		key_bindings: 'shift+tab',
		event_path: 'global.app.appSwitch',
		readonly: true,
		options: { keydown: true, keyup: false }
	},
	{
		key_bindings: '*',
		special_key: 'shift',
		event_path: 'global.app.handleAppSwitch',
		readonly: true,
		options: { keydown: false, keyup: true }
	}
] as Shortcuts['keys'])

export type ShortcutEventPaths = 'global.app.toggleAppMenu' | 'global.app.appSwitch' | 'global.app.handleAppSwitch'
