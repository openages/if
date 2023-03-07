import { getAppPath, getPath, is_dev } from './src/utils'
import getDarkIconPath from './src/utils/getDarkIconPath'

import type { BrowserWindowConstructorOptions } from 'electron'

export default {
	windowOptions: {
		title: 'IF',
		width: 1410,
		height: 870,
		minWidth: 900,
		minHeight: 555,
		frame: false,
		fullscreen: false,
		transparent: true,
		autoHideMenuBar: true,
		titleBarStyle: 'hidden',
		trafficLightPosition: { x: 9, y: 9 },
		icon: getPath('assets/icons/logo.png'),
		webPreferences: { preload: getPath('load/preload.js') }
	} as BrowserWindowConstructorOptions,
	windowUrl: is_dev ? 'http://localhost:8000' : `file://${getAppPath('index.html')}`,
	loadingUrl: `file://${getPath('load/loading.html')}`,
	dockIconPath: getPath('assets/icons/dock.png'),
	getTrayIcon: (dark?: boolean) => getPath(`assets/icons/tray/logo${getDarkIconPath(dark)}.png`)
}
