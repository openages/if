import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import Utils from '@/models/utils'
import { getComputedStyleValue } from '@/utils'
import { setStorageWhenChange } from '@openages/stk'

@injectable()
export default class Index {
	dirtree_width = 0
	dirtree_prev = 0

	constructor(public utils: Utils) {
		makeAutoObservable(this, {}, { autoBind: true })

		this.utils.acts = [setStorageWhenChange(['dirtree_prev', 'dirtree_width'], this)]

		this.init()
	}

	init() {
		if (this.dirtree_width === 0 && this.dirtree_prev === 0) {
			this.setDirTreeWidth(
				getComputedStyleValue(document.documentElement, '--dirtree_width'),
				this.dirtree_width === 0
			)

			return
		}

		this.setDirTreeWidth(this.dirtree_width, this.dirtree_width === 0)
	}

	toggleDirTreeVisible() {
		if (this.dirtree_width === 0) return this.setDirTreeWidth(this.dirtree_prev || 222)

		this.dirtree_prev = this.dirtree_width

		this.setDirTreeWidth(0, true)
	}

	setDirTreeWidth(v: number, hide?: boolean) {
		if (!hide) if (v < 180 || v > 360) return

		this.dirtree_width = v

		document.documentElement.style.setProperty('--dirtree_width', v + 'px')
	}

	off() {
		this.utils.off()
	}
}
