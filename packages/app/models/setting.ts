import { compress, decompress } from 'compress-json'
import dayjs from 'dayjs'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import Utils from '@/models/utils'
import {
	conf,
	convertFile,
	downloadFile,
	is_electron_shell,
	markJsonUndefined,
	now,
	setFavicon,
	setGlobalAnimation,
	sleep,
	unmarkJsonUndefined,
	uploadFile
} from '@/utils'
import { setStorageWhenChange } from '@openages/stk/mobx'

import type { Theme } from '@/appdata'

@injectable()
export default class Index {
	visible = false
	theme: Theme = 'light'
	auto_theme = false
	color_main_rgb = '255,0,0'
	show_bar_title = false
	page_width = '780px'

	constructor(public utils: Utils) {
		makeAutoObservable(this, { utils: false }, { autoBind: true })

		this.init()
	}

	init() {
		this.off()

		this.utils.acts = [
			setStorageWhenChange(['theme', 'auto_theme', 'color_main_rgb', 'show_bar_title', 'page_width'], this)
		]

		this.setTheme(this.theme || 'light', true)
		this.setColorMain(this.color_main_rgb || '255,0,0')
		this.setPageWidth(this.page_width || '780px')
		this.checkTheme()
		this.on()
	}

	setTheme(v: Theme, initial?: boolean) {
		const change = () => {
			this.theme = v

			document.documentElement.setAttribute('data-theme', v)
			document.documentElement.style.colorScheme = v

			this.setBgColorLoad()
		}

		if (!initial) {
			setGlobalAnimation()

			document.startViewTransition(change)
		} else {
			change()
		}
	}

	toggleAutoTheme() {
		this.auto_theme = !this.auto_theme

		this.checkTheme()
	}

	checkTheme() {
		if (!this.auto_theme) return

		const now = dayjs()
		const hour = now.hour()

		this.setTheme(hour >= 6 && hour < 18 ? 'light' : 'dark')
	}

	setColorMain(v: string) {
		this.color_main_rgb = v

		const color = `rgb(${v})`

		document.documentElement.style.setProperty('--color_main_rgb', v)

		setFavicon(color)

		this.setBgColorLoad()
	}

	setBgColorLoad() {
		if (!is_electron_shell) return

		conf.set('bg_color_load', this.theme === 'light' ? `rgb(${this.color_main_rgb})` : '#3b3b41')
	}

	setPageWidth(v: string) {
		this.page_width = v

		document.documentElement.style.setProperty('--limited_width', v)
	}

	toggleVisible(v?: boolean) {
		if (v) {
			this.visible = v
		} else {
			this.visible = !this.visible
		}
	}

	async backupExport() {
		$app.Event.emit('app/setLoading', { visible: true, desc: $t('setting.Backup.export.loading') })

		const json = await $db.exportJSON()

		await sleep(600)

		markJsonUndefined(json)

		const ifbk = compress(json)
		const target = JSON.stringify(ifbk)

		$app.Event.emit('app/setLoading', { visible: false })

		downloadFile(`if_backup_file_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}`, target, 'ifbk')
	}

	async backupImport() {
		const files = await uploadFile({ accept: '.ifbk' })

		if (files) {
			try {
				$app.Event.emit('app/setLoading', { visible: true, desc: $t('setting.Backup.import.loading') })

				const text = await convertFile(files[0])

				await sleep(600)

				const json = decompress(JSON.parse(text))

				unmarkJsonUndefined(json)

				await $db.importJSON(json)
			} catch (error) {
				$message.error(`${$t('setting.Backup.import.error')} error: ${(error as Error)?.message}`)
			}
		}

		$app.Event.emit('app/setLoading', { visible: false })
	}

	on() {
		$app.Event.on('global.setting.toggleVisible', this.toggleVisible)
	}

	off() {
		$app.Event.off('global.setting.toggleVisible', this.toggleVisible)

		this.utils.off()
	}
}
