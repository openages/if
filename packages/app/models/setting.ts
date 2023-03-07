import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { nav_items } from '@/appdata'
import { setFavicon, setGlobalAnimation, setStorageWhenChange } from '@/utils'

import type { Theme } from '@/appdata'

@injectable()
export default class Index {
	theme: Theme = 'light'
	color_main = '#ff0000'
	nav_items = nav_items
	show_bar_title = false

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
		setStorageWhenChange(['theme', 'color_main', 'nav_items', 'show_bar_title'], this)

		this.setTheme(this.theme || 'light', true)
		this.setColorMain(this.color_main || '#ff0000')
	}

	setTheme(theme: Theme, initial?: boolean) {
		if (!initial) setGlobalAnimation()

		this.theme = theme

		document.documentElement.setAttribute('data-theme', theme)
		document.documentElement.style.colorScheme = theme
	}

	setColorMain(color: string) {
            this.color_main = color

            document.documentElement.style.setProperty('--color_main', color)
            
            setFavicon(color)
	}
}
