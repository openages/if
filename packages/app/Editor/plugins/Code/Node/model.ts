import {
	$createParagraphNode,
	$getSelection,
	$insertNodes,
	$isNodeSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_LOW,
	KEY_BACKSPACE_COMMAND,
	KEY_DELETE_COMMAND,
	KEY_ENTER_COMMAND,
	SELECTION_CHANGE_COMMAND
} from 'lexical'
import { makeAutoObservable } from 'mobx'
import { getHighlighter } from 'shiki'
import { injectable } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import { mergeRegister } from '@lexical/utils'

import type { BundledLanguage, HighlighterGeneric } from 'shiki'

import type CodeNode from './index'
import type { MouseEvent, ChangeEvent } from 'react'
import type { LexicalEditor } from 'lexical'

@injectable()
export default class Index {
	key = ''
	editor = null as LexicalEditor
	input = null as HTMLTextAreaElement
	node = null as CodeNode

	highlighter = null as HighlighterGeneric<BundledLanguage, 'github-light' | 'github-dark-dimmed'>
	lang = '' as BundledLanguage
	source = ''
	html = ''
	compositing = false

	selected = false
	signal_html = false

	setSelected = null as (v: boolean) => void
	clearSelection = null as () => void
	unregister = null as () => void

	constructor(public global: GlobalModel) {
		makeAutoObservable(
			this,
			{
				global: false,
				key: false,
				editor: false,
				input: false,
				node: false,
				highlighter: false,
				lang: false,
				source: false,
				html: false,
				compositing: false,
				setSelected: false,
				clearSelection: false,
				unregister: false
			},
			{ autoBind: true }
		)
	}

	init(
		editor: Index['editor'],
		node: CodeNode,
		key: Index['key'],
		setSelected: Index['setSelected'],
		clearSelection: Index['clearSelection']
	) {
		this.editor = editor
		this.node = node
		this.key = key

		this.setSelected = setSelected
		this.clearSelection = clearSelection

		this.register()
	}

	async getHighlighter(lang: BundledLanguage) {
		this.lang = lang
		this.highlighter = await getHighlighter({ langs: [lang], themes: ['github-light', 'github-dark-dimmed'] })

		this.render()
	}

	createInput(wrap: HTMLSpanElement) {
		const el = document.createElement('textarea')

		el.className = 'input_wrap w_100 h_100 border_box absolute z_index_10'
		el.autocomplete = 'off'
		el.autocapitalize = 'off'
		el.spellcheck = false
		el.autofocus = true

		wrap.append(el)

		this.input = el

		this.input.addEventListener('input', this.onInput)
		this.input.addEventListener('keydown', this.onKeyDown)
		this.input.addEventListener('compositionstart', this.compositionStart)
		this.input.addEventListener('compositionend', this.compositionEnd)
	}

	render() {
		if (!this.selected) {
			this.clearSelection()
			this.setSelected(true)
		}

		if (!this.highlighter) return

		this.html = this.highlighter.codeToHtml(this.source || ' ', {
			lang: this.lang,
			theme: this.global.setting.theme === 'light' ? 'github-light' : 'github-dark-dimmed'
		})

		this.signal_html = !this.signal_html
	}

	onInput(e: unknown) {
		if (this.compositing) return

		this.editor.update(() => {
			const target = this.node.getWritable()

			target.__value = (e as ChangeEvent<HTMLTextAreaElement>).target.value
		})
	}

	onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Tab') {
			e.preventDefault()

			const el = e.target as HTMLTextAreaElement
			const start = el.selectionStart
			const end = el.selectionEnd
			const spaces = '    '

			const value = el.value.substring(0, start) + spaces + el.value.substring(end)

			const selection_position = start + spaces.length

			el.value = value
			el.selectionStart = el.selectionEnd = selection_position

			this.source = value

			this.render()

			this.editor.update(() => {
				const target = this.node.getWritable()

				target.__value = value
			})
		}
	}

	compositionStart() {
		this.compositing = true
	}

	compositionEnd(e: unknown) {
		this.compositing = false

		this.onInput(e)
	}

	onClick(e: MouseEvent<HTMLSpanElement>) {
		if (this.selected) return true

		const ref = this.editor.getElementByKey(this.key)

		if (e.target === ref || ref.contains(e.target as HTMLElement)) {
			if (e.shiftKey) {
				this.setSelected(!this.selected)
			} else {
				this.clearSelection()
				this.setSelected(true)
			}

			return true
		}

		return false
	}

	onEnter() {
		if (!this.selected) return false

		// const target = this.node.getTopLevelElement().insertAfter($createParagraphNode()) as ParagraphNode

		// window.requestAnimationFrame(() => this.editor.update(() => target.selectStart()))

		return false
	}

	onDelete(e: KeyboardEvent) {
		if (this.selected && $isNodeSelection($getSelection())) {
			e.preventDefault()

			const alone = !this.node.__prev && !this.node.__next

			this.node.remove()

			if (alone) $insertNodes([$createParagraphNode()])

			return true
		}

		return false
	}

	onKeyspace(e: KeyboardEvent) {
		if (this.source) return false

		this.onDelete(e)

		return true
	}

	checkSelected() {
		if (this.selected) return

		const selection = $getSelection()

		if (!selection) return

		const nodes = selection.getNodes()
		const node = nodes.at(0)

		if (nodes.length !== 1 || !node) return

		if (this.node.is(node)) {
			this.setSelected(true)
		}
	}

	register() {
		this.unregister = mergeRegister(
			this.editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				(_, active_editor) => {
					this.editor = active_editor

					this.checkSelected()

					return false
				},
				COMMAND_PRIORITY_LOW
			),
			this.editor.registerCommand<MouseEvent>(CLICK_COMMAND, this.onClick, COMMAND_PRIORITY_LOW),
			this.editor.registerCommand(KEY_ENTER_COMMAND, this.onEnter, COMMAND_PRIORITY_LOW),
			this.editor.registerCommand(KEY_DELETE_COMMAND, this.onDelete, COMMAND_PRIORITY_LOW),
			this.editor.registerCommand(KEY_BACKSPACE_COMMAND, this.onKeyspace, COMMAND_PRIORITY_LOW)
		)
	}

	off() {
		this.input.removeEventListener('input', this.onInput)
		this.input.removeEventListener('keydown', this.onKeyDown)
	}
}
