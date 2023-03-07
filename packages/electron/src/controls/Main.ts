import { BrowserView, BrowserWindow } from 'electron'
import config from 'Root/config'

export interface IAppMainWindow extends BrowserWindow {
	removeLoading: () => void
}

export default class Index extends BrowserWindow {
	private window: IAppMainWindow | null
	private loading: BrowserView | null

	constructor() {
		super(config.windowOptions)

		this.window = this
		this.loading = null

		this.load()
		this.register()
		this.loadURL(config.windowUrl)
	}

	register() {
		if (this.window === null) return

		this.window.on('resize', () => {
			if (this.window === null) return
			if (this.loading === null) return

			const { width, height } = this.window.getBounds()

			this.loading.setBounds({ x: 0, y: 0, width, height })
		})

		this.window.on('close', (e) => {
			if (this.window === null) return

			if (this.window['hide'] && this.window['setSkipTaskbar']) {
				this.window.hide()

				e.preventDefault()
			}
		})

		this.window.on('closed', () => {
			this.window = null
		})
	}

	load() {
		if (this.window === null) return

		const { width, height } = this.window.getBounds()

		this.loading = new BrowserView()

		this.window.setBrowserView(this.loading)
		this.loading.setBounds({ x: 0, y: 0, width, height })

		this.loading.webContents.loadURL(config.loadingUrl)
		this.loading.webContents.on('dom-ready', () => this.window?.show())
	}

	destory() {
		this.window = null
	}

	removeLoading() {
		this.window?.removeBrowserView(this.loading as BrowserView)
	}
}
