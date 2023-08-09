import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { setFavicon, setGlobalAnimation, setStorageWhenChange } from '@/utils'

import type { Theme } from '@/appdata'

@injectable()
export default class Index {
	theme: Theme = 'light'
	color_main_rgb = '255,0,0'
	show_bar_title = false
	page_width = '780px'

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
		setStorageWhenChange(['theme', 'color_main_rgb', 'show_bar_title', 'page_width'], this)

		this.setTheme(this.theme || 'light', true)
		this.setColorMain(this.color_main_rgb || '255,0,0')
		this.setPageWidth(this.page_width || '780px')
	}

	setTheme(v: Theme, initial?: boolean) {
		if (!initial) setGlobalAnimation()

		this.theme = v

		document.documentElement.setAttribute('data-theme', v)
		document.documentElement.style.colorScheme = v
	}

	setColorMain(v: string) {
		this.color_main_rgb = v

		document.documentElement.style.setProperty('--color_main_rgb', v)

		setFavicon(`rgb(${v})`)
	}

	setPageWidth(v: string) {
		this.page_width = v

		document.documentElement.style.setProperty('--limited_width', v)
	}
}
