import { app, nativeTheme, Tray } from 'electron'
import config from 'Root/config'

import type { BrowserWindow, Tray as ITray } from 'electron'

export default class Index {
	private window: BrowserWindow | null
	private tray: ITray | null = null

	constructor(mainWindow: BrowserWindow) {
		this.window = mainWindow || null

		this.initTray()
	}

	get() {
		return this.tray
	}

	initTray() {
		this.tray = new Tray(config.getTrayIcon())

		this.tray.setToolTip(app.name)

		this.tray.on('click', () => {
			this.window?.show()
		})

		nativeTheme.on('updated', ({ sender }: { sender: Electron.NativeTheme }) => {
			this.tray?.setImage(config.getTrayIcon(sender.shouldUseDarkColors))
		})
	}
}
