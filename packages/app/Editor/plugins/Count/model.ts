import { COMMAND_PRIORITY_LOW } from 'lexical'
import { debounce } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import getLength from 'string-length'
import { injectable } from 'tsyringe'

import { regex_punctuation } from '@/appdata'
import { TOGGLE_COUNT } from '@/Editor/commands'
import Utils from '@/models/utils'
import { mergeRegister } from '@lexical/utils'
import { setStorageWhenChange } from '@openages/stk/mobx'

import type { LexicalEditor } from 'lexical'
import type { CSSProperties } from 'react'

@injectable()
export default class Index {
	id = ''
	editor = null as LexicalEditor
	container = null as HTMLElement
	observer = null as ResizeObserver

	count = false
	visible = false
	style = {} as CSSProperties
	count_mode = 'total' as 'total' | 'filted'
	counts_total = 0
	counts_filted = 0
	visible_count_popover = false

	unregister = null as () => void

	constructor(public utils: Utils) {
		makeAutoObservable(
			this,
			{
				utils: false,
				id: false,
				editor: false,
				container: false,
				observer: false,
				unregister: false,
				onChangeText: false
			},
			{ autoBind: true }
		)

		this.onChangeText = debounce(this.onChangeText.bind(this), 3000)
	}

	init(id: Index['id'], editor: Index['editor']) {
		this.utils.acts = [setStorageWhenChange([{ note_count_node: 'count_mode' }], this, { useSession: true })]

		this.id = id
		this.editor = editor
		this.container = document.getElementById(this.id)

		this.on()

		if (this.count) {
			this.addEventLisnter()
			this.getPosition()
		}
	}

	getPosition() {
		const { left } = this.container.getBoundingClientRect()

		this.style = { left, bottom: 0 }
		this.visible = true
	}

	updateCount(v: Index['count']) {
		this.count = v

		if (v) {
			this.addEventLisnter()
			this.getPosition()
		} else {
			this.removeEventLisnter()

			this.visible = false
			this.style = {}
		}

		return false
	}

	onChangeText(v: string) {
		const string_total = v.replace(/\s/g, '')
		const string_filted = string_total.replace(regex_punctuation, '')

		this.counts_total = getLength(string_total)
		this.counts_filted = getLength(string_filted)
	}

	addEventLisnter() {
		this.removeEventLisnter()

		this.unregister = mergeRegister(this.editor.registerTextContentListener(this.onChangeText))

		this.observer = new ResizeObserver(debounce(this.getPosition, 450, { leading: true }))

		this.observer.observe(this.container)
	}

	removeEventLisnter() {
		if (this.unregister) {
			this.unregister()

			this.unregister = null
		}

		if (this.observer) {
			this.observer.unobserve(this.container)
			this.observer.disconnect()
		}
	}

	on() {
		this.utils.acts.push(this.editor.registerCommand(TOGGLE_COUNT, this.updateCount, COMMAND_PRIORITY_LOW))
	}

	off() {
		this.removeEventLisnter()

		this.utils.off()
	}
}
