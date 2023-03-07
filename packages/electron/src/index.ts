import { app, ipcMain } from 'electron'
import config from 'Root/config'

import { Main, Tray } from '@/controls'
import { is_dev, is_mac } from '@/utils'

import type { Tray as TrayType } from 'electron'
import type { IAppMainWindow } from '@/controls'

class App {
	private window: IAppMainWindow | null
	private tray: TrayType | null

	constructor() {
		this.window = null
		this.tray = null
	}

	init() {
		this.register()
		this.ipc()
	}

	register() {
		app.whenReady().then(() => {
			this.window = new Main()
			this.tray = new Tray(this.window).get()

			if (is_dev) this.window.webContents.openDevTools({ mode: 'bottom' })
		})

		app.on('window-all-closed', () => {
			if (!is_mac) app.quit()
		})

		app.on('before-quit', () => {
			this.tray?.destroy()
			this.window?.destroy()
		})

		if (is_mac) this.macOSHandler()
	}

	ipc() {
		ipcMain.on('stop-loading', () => {
			this.window?.removeLoading()
		})
	}

	macOSHandler() {
		app.dock.setIcon(config.dockIconPath)

		app.on('activate', () => {
			this.window?.show()
		})
	}
}

new App().init()
