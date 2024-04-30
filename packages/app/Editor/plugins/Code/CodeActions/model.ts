import to from 'await-to-js'
import {
	$getNodeByKey,
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_LOW,
	SELECTION_CHANGE_COMMAND
} from 'lexical'
import { makeAutoObservable } from 'mobx'

import { prettier_langs } from '@/Editor/utils'
import { mergeRegister } from '@lexical/utils'

import CodeNode from '../CodeNode'
import { $isCodeNode, $isCodeTextNode } from '../utils'

import type { LexicalEditor } from 'lexical'
import type { BundledLanguage } from 'shiki'

export default class Index {
	id = ''
	editor = null as LexicalEditor
	key = ''

	lang = '' as BundledLanguage
	formatable = false
	position = { left: 0, top: 0 }
	visible = false

	unregister = null as () => void

	constructor() {
		makeAutoObservable(this, { id: false, editor: false, key: false, unregister: false }, { autoBind: true })
	}

	init(id: Index['id'], editor: Index['editor']) {
		this.id = id
		this.editor = editor

		this.register()
	}

	reset() {
		this.key = ''
		this.lang = '' as BundledLanguage
		this.formatable = false
		this.position = { left: 0, top: 0 }
		this.visible = false
	}

	onSelection() {
		const selection = $getSelection()

		if (!$isRangeSelection(selection)) return false

		const anchor = selection.anchor.getNode()

		if (!$isCodeTextNode(anchor) && !$isCodeNode(anchor)) {
			if (!this.key) return false

			this.reset()

			return false
		}

		const node = ($isCodeNode(anchor) ? anchor : anchor.getTopLevelElement()) as CodeNode

		if (this.key === node.__key) return false

		const el = this.editor.getElementByKey(node.__key)
		const { right, top } = el.getBoundingClientRect()

		this.key = node.__key
		this.lang = node.__lang
		this.formatable = prettier_langs[node.__lang] ? true : false
		this.position = { left: right - (78 + 76), top: top - 32 }
		this.visible = true

		return false
	}

	onChangeLang(v: BundledLanguage) {
		if (!this.key) return

		console.log(v)

		this.editor.update(() => {
			const node = $getNodeByKey(this.key) as CodeNode
			const target = node.getWritable()

			target.__lang = v

			this.lang = v
			this.formatable = prettier_langs[v] ? true : false
		})
	}

	onCopy() {
		if (!this.key) return

		this.editor.getEditorState().read(() => {
			const node = $getNodeByKey(this.key)
			const text = node.getTextContent()

			navigator.clipboard.writeText(text).then(() => {
				$message.success($t('translation:common.copied'))
			})
		})
	}

	async onFormat() {
		if (!this.key || !this.formatable) return

		const { lang, text } = this.editor.getEditorState().read(() => {
			const node = $getNodeByKey(this.key) as CodeNode

			return { lang: node.__lang, text: node.getTextContent() }
		})

		const options = prettier_langs[lang]
		const plugins = await Promise.all(options.getPlugins())

		options.plugins = plugins

		const { format } = await import('prettier/standalone')
		const [err, target] = await to(format(text, options))

		if (err) {
			if (err.message) {
				$modal.error({
					title: $t('translation:common.error'),
					content: err.message,
					centered: true,
					getContainer: () => document.getElementById(this.id)
				})
			}

			return
		}

		this.editor.update(() => {
			const node = $getNodeByKey(this.key) as CodeNode

			const selection = node.select(0)

			selection.insertText(target)
		})
	}

	register() {
		this.unregister = mergeRegister(
			this.editor.registerCommand(SELECTION_CHANGE_COMMAND, this.onSelection, COMMAND_PRIORITY_LOW)
		)
	}

	off() {
		this.unregister()
	}
}
