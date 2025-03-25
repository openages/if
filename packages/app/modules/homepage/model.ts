import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Utils } from '@/models'
import { setStorageWhenChange } from '@openages/stk/mobx'

import type { App } from '@/types'

export const bgs = [
	require('@/public/images/bg_homepage_0.jpg'),
	require('@/public/images/bg_homepage_1.jpg'),
	require('@/public/images/bg_homepage_2.jpg'),
	require('@/public/images/bg_homepage_3.jpg'),
	require('@/public/images/bg_homepage_4.jpg'),
	require('@/public/images/puzzle.png')
]

@injectable()
export default class Index {
	bg_index = 0
	module_type = '' as App.ModuleType
	files_type = '' as 'latest' | 'star'
	drawer_type = '' as 'dirtree' | 'files'
	drawer_visible = false

	constructor(public utils: Utils) {
		makeAutoObservable(this, { utils: false }, { autoBind: true })
	}

	init() {
		this.utils.acts.push(setStorageWhenChange([{ [`homepage:bg_index`]: 'bg_index' }], this))

		this.on()
	}

	showDirtree(v: App.ModuleType) {
		this.module_type = v
		this.drawer_type = 'dirtree'
		this.drawer_visible = true
	}

	showFiles(v: Index['files_type']) {
		this.files_type = v
		this.drawer_type = 'files'
		this.drawer_visible = true
	}

	on() {
		$app.Event.on('homepage.showDirtree', this.showDirtree)
		$app.Event.on('homepage.showFiles', this.showFiles)
	}

	off() {
		this.utils.off()

		$app.Event.off('homepage.showDirtree', this.showDirtree)
		$app.Event.off('homepage.showFiles', this.showFiles)
	}
}
