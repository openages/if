import {
	$createLineBreakNode,
	$createTabNode,
	$getNodeByKey,
	$getSelection,
	$insertNodes,
	$isLineBreakNode,
	$isRangeSelection,
	$isTabNode,
	$isTextNode as $isLexicalTextNode,
	COMMAND_PRIORITY_EDITOR,
	COMMAND_PRIORITY_LOW,
	INDENT_CONTENT_COMMAND,
	INSERT_TAB_COMMAND,
	KEY_ARROW_DOWN_COMMAND,
	KEY_ARROW_UP_COMMAND,
	KEY_TAB_COMMAND,
	MOVE_TO_END,
	MOVE_TO_START,
	OUTDENT_CONTENT_COMMAND,
	TextNode as LexicalTextNode
} from 'lexical'
import { codeToTokens } from 'shiki'

import { INSERT_CODE_COMMAND } from '@/Editor/commands'
import { mergeRegister } from '@lexical/utils'

import CodeNode from './Node'
import TextNode from './Text'
import { $createCodeNode, $createTextNode, $isCodeNode, $isTextNode, getCodeNodeOfLine } from './utils'

import type { BundledLanguage, ThemedToken } from 'shiki'
import type {
	LexicalEditor,
	NodeMutation,
	LexicalNode,
	RangeSelection,
	BaseSelection,
	PointType,
	LexicalCommand,
	TabNode,
	LineBreakNode
} from 'lexical'
import type { IPropsCode } from './types'
import type { GlobalModel } from '@/context/app'

export default class Index {
	theme = '' as GlobalModel['setting']['theme']
	editor = null as LexicalEditor
	lines = 0
	gutter = ''
	current = new Set()

	unregister = null as () => void

	constructor() {}

	init(theme: Index['theme'], editor: Index['editor']) {
		this.theme = theme
		this.editor = editor

		this.register()
	}

	async getTokens(text: string, lang: BundledLanguage) {
		const { tokens } = await codeToTokens(text, {
			lang,
			theme: this.theme === 'light' ? 'github-light' : 'github-dark-dimmed'
		})

		return tokens
	}

	updateGutter(node: CodeNode) {
		const el = this.editor.getElementByKey(node.__key)

		if (el === null) return

		const children = node.getChildren()

		if (children.length === this.lines) return

		this.lines = children.length

		let gutter = '1'
		let count = 1

		for (let i = 0; i < children.length; i++) {
			if ($isLineBreakNode(children[i])) {
				gutter += '\n' + ++count
			}
		}

		this.gutter = gutter
	}

	async keepSelection(node_key: string, updateFn: () => Promise<boolean>) {
		const node = $getNodeByKey(node_key) as CodeNode
		const selection = $getSelection()

		if (!$isCodeNode(node) || !node.isAttached()) return
		if (!$isRangeSelection(selection)) return updateFn()

		const changes = await updateFn()

		if (!changes) return

		const anchor = selection.anchor
		const offset = anchor.offset
		const new_line = anchor.type === 'element' && $isLineBreakNode(node.getChildAtIndex(anchor.offset - 1))

		let text_offset = 0

		if (!new_line) {
			const anchor_node = anchor.getNode()
			const prev_offset = anchor_node
				.getPreviousSiblings()
				.reduce((offset, node) => offset + node.getTextContentSize(), 0)

			text_offset = offset + prev_offset
		}

		if (new_line) return anchor.getNode().select(offset, offset)

		node.getChildren().some(node => {
			const is_text = $isLexicalTextNode(node)

			if (is_text || $isLineBreakNode(node)) {
				const size = node.getTextContentSize()

				if (is_text && size >= text_offset) {
					node.select(text_offset, text_offset)

					return true
				}

				text_offset -= size
			}

			return false
		})
	}

	getHighlightNodes(tokens: Array<string | Array<ThemedToken>>) {
		const nodes: Array<LexicalNode> = []

		for (const token of tokens) {
			if (typeof token === 'string') {
				const partials = token.split(/(\n|\t)/)

				for (let i = 0; i < partials.length; i++) {
					const part = partials[i]

					if (part === '\n' || part === '\r\n') {
						nodes.push($createLineBreakNode())
					} else if (part === '\t') {
						nodes.push($createTabNode())
					} else if (part.length > 0) {
						nodes.push($createTextNode({ text: part }))
					}
				}
			} else {
				// const { content } = token
				// if (typeof content === 'string') {
				// 	nodes.push(...this.getHighlightNodes([content])
				// } else if (Array.isArray(content)) {
				// 	nodes.push(...getHighlightNodes(content, token.type))
				// }
			}
		}

		return nodes
	}

	getDiffRange(prev_nodes: Array<TextNode>, next_nodes: Array<TextNode>) {
		let i = 0

		while (i < prev_nodes.length) {
			if (prev_nodes[i].__text === next_nodes[i].__text) {
				break
			}

			i++
		}

		const prev_nodes_length = prev_nodes.length
		const next_nodes_length = next_nodes.length
		const min = Math.min(prev_nodes_length, next_nodes_length) - i

		let match = 0

		while (match < min) {
			match++

			if (prev_nodes[prev_nodes_length - match].__text === next_nodes[next_nodes_length - match].__text) {
				match--

				break
			}
		}

		const from = i
		const to = prev_nodes_length - match
		const nodes = next_nodes.slice(i, next_nodes_length - match)

		return { from, to, nodes }
	}

	getCodeLines(selection: RangeSelection) {
		const nodes = selection.getNodes()
		const lines: Array<Array<LexicalNode>> = [[]]

		if (nodes.length === 1 && $isCodeNode(nodes[0])) return lines

		let last: Array<LexicalNode> = lines[0]

		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i]

			if ($isLineBreakNode(node)) {
				if (i !== 0 && last.length > 0) {
					last = []

					lines.push(last)
				}
			} else {
				last.push(node)
			}
		}

		return lines
	}

	isSelectionInCode(selection: null | BaseSelection): boolean {
		if (!$isRangeSelection(selection)) return false

		const anchor_node = selection.anchor.getNode()
		const focus_node = selection.focus.getNode()

		if (anchor_node.is(focus_node) && $isCodeNode(anchor_node)) return true

		const parent = anchor_node.getParent()

		return $isCodeNode(parent) && parent.is(focus_node.getParent())
	}

	insert(payload: IPropsCode) {
		const node = $createCodeNode(payload)

		$insertNodes([node])

		return true
	}

	getStartOfCodeInLine(anchor: TextNode | TabNode, offset: number) {
		let last: { node: TextNode | TabNode | LineBreakNode; offset: number } = null
		let last_non_blank: { node: TextNode; offset: number } = null
		let node: TextNode | TabNode | LineBreakNode = anchor
		let node_offset = offset
		let node_text = anchor.getTextContent()

		while (true) {
			if (node_offset === 0) {
				node = node.getPreviousSibling()

				if (node === null) {
					break
				}

				if ($isLineBreakNode(node)) {
					last = { node, offset: 1 }

					break
				}

				node_offset = Math.max(0, node.getTextContentSize() - 1)
				node_text = node.getTextContent()
			} else {
				node_offset--
			}

			const character = node_text[node_offset]

			if ($isTextNode(node) && character !== ' ') {
				last_non_blank = { node: node as TextNode, offset: node_offset }
			}
		}
		if (last_non_blank !== null) return last_non_blank

		let code_offset = null

		if (offset < anchor.getTextContentSize()) {
			if ($isTextNode(anchor)) {
				code_offset = anchor.getTextContent()[offset]
			}
		} else {
			const next_node = anchor.getNextSibling()

			if ($isTextNode(next_node)) {
				code_offset = next_node.getTextContent()[0]
			}
		}

		if (code_offset !== null && code_offset !== ' ') {
			return last
		} else {
			const nextNonBlank = this.findNextNonBlankInLine(anchor, offset)

			if (nextNonBlank !== null) {
				return nextNonBlank
			} else {
				return last
			}
		}
	}

	findNextNonBlankInLine(anchor: LexicalNode, offset: number) {
		let node = anchor
		let node_offset = offset
		let node_text = anchor.getTextContent()
		let node_size = anchor.getTextContentSize()

		while (true) {
			if (!$isTextNode(node) || node_offset === node_size) {
				node = node.getNextSibling()

				if (node === null || $isLineBreakNode(node)) {
					return null
				}

				if ($isTextNode(node)) {
					node_offset = 0
					node_text = node.getTextContent()
					node_size = node.getTextContentSize()
				}
			}

			if ($isTextNode(node)) {
				if (node_text[node_offset] !== ' ') {
					return { node, offset: node_offset }
				}

				node_offset++
			}
		}
	}

	onMutation(v: Map<string, NodeMutation>) {
		this.editor.update(() => {
			for (const [key, type] of v) {
				if (type !== 'destroyed') {
					const node = $getNodeByKey(key) as CodeNode

					if (node) this.updateGutter(node)
				}
			}
		})
	}

	transformCodeNode(node: CodeNode) {
		const node_key = node.__key

		if (this.current.has(node_key)) return

		this.current.add(node_key)

		this.editor.update(
			() => {
				this.keepSelection(node_key, async () => {
					const node = $getNodeByKey(node_key) as CodeNode

					if (!$isCodeNode(node) || !node.isAttached()) {
						return false
					}

					const code = node.getTextContent()
					const tokens = await this.getTokens(code, node.__lang)

					const highlight_nodes = this.getHighlightNodes(tokens)
					const range = this.getDiffRange(node.getChildren(), highlight_nodes as Array<TextNode>)

					const { from, to, nodes } = range

					if (from !== to || nodes.length) {
						node.splice(from, to - from, nodes)

						return true
					}

					return false
				})
			},
			{
				skipTransforms: true,
				onUpdate: () => {
					this.current.delete(node_key)
				}
			}
		)
	}

	transformTextNode(node: TextNode) {
		const parent = node.getParent()

		if ($isCodeNode(parent)) {
			return this.transformCodeNode(parent as CodeNode)
		}

		if ($isTextNode(node)) {
			node.replace($createTextNode({ text: node.__text }))
		}
	}

	onTab(event: KeyboardEvent) {
		const shift_key = event.shiftKey
		const selection = $getSelection()

		let command = null

		if (!$isRangeSelection(selection) || !this.isSelectionInCode(selection)) return

		const indent_outdent = !shift_key ? INDENT_CONTENT_COMMAND : OUTDENT_CONTENT_COMMAND
		const tab_outdent = !shift_key ? INSERT_TAB_COMMAND : OUTDENT_CONTENT_COMMAND
		const lines = this.getCodeLines(selection)

		if (lines.length > 1) command = indent_outdent

		const selectionNodes = selection.getNodes()
		const firstNode = selectionNodes[0] as CodeNode

		if ($isCodeNode(firstNode)) {
			command = indent_outdent
		}

		const first_of_line = getCodeNodeOfLine('first', firstNode)
		const last_of_line = getCodeNodeOfLine('last', firstNode)

		const anchor = selection.anchor
		const focus = selection.focus

		let selection_first: PointType
		let selection_last: PointType

		if (focus.isBefore(anchor)) {
			selection_first = focus
			selection_last = anchor
		} else {
			selection_first = anchor
			selection_last = focus
		}

		if (
			first_of_line !== null &&
			last_of_line !== null &&
			selection_first.key === first_of_line.getKey() &&
			selection_first.offset === 0 &&
			selection_last.key === last_of_line.getKey() &&
			selection_last.offset === last_of_line.getTextContentSize()
		) {
			command = indent_outdent
		}

		command = tab_outdent

		if (!command) return false

		event.preventDefault()

		this.editor.dispatchCommand(command, undefined)

		return true
	}

	onInsertTab() {
		const selection = $getSelection()

		if (!this.isSelectionInCode(selection)) return false

		$insertNodes([$createTabNode()])

		return true
	}

	onMultilineIndent(type: LexicalCommand<void>) {
		const selection = $getSelection()

		if (!$isRangeSelection(selection) || !this.isSelectionInCode(selection)) return false

		const lines = this.getCodeLines(selection)

		if (lines.length > 1) {
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i]

				if (line.length > 0) {
					let first_of_line = line[0]

					if (i === 0) {
						first_of_line = getCodeNodeOfLine('first', first_of_line as CodeNode)
					}

					if (first_of_line !== null) {
						if (type === INDENT_CONTENT_COMMAND) {
							first_of_line.insertBefore($createTabNode())
						} else if ($isTabNode(first_of_line)) {
							first_of_line.remove()
						}
					}
				}
			}
			return true
		}

		const first_node = selection.getNodes()[0]

		if ($isCodeNode(first_node)) {
			if (type === INDENT_CONTENT_COMMAND) {
				selection.insertNodes([$createTabNode()])
			}

			return true
		}

		const first_of_line = getCodeNodeOfLine('first', first_node as CodeNode)

		if (type === INDENT_CONTENT_COMMAND) {
			if ($isLineBreakNode(first_of_line)) {
				first_of_line.insertAfter($createTabNode())
			} else {
				first_of_line.insertBefore($createTabNode())
			}
		} else if ($isTabNode(first_of_line)) {
			first_of_line.remove()
		}

		return true
	}

	onShiftLines(type: LexicalCommand<KeyboardEvent>, event: KeyboardEvent) {
		const selection = $getSelection()

		if (!$isRangeSelection(selection)) return false

		const { anchor, focus } = selection
		const anchor_offset = anchor.offset
		const focus_offset = focus.offset
		const anchor_node = anchor.getNode()
		const focus_node = focus.getNode()
		const arrow_up = type === KEY_ARROW_UP_COMMAND

		if (
			!this.isSelectionInCode(selection) ||
			!($isTextNode(anchor_node) || $isTabNode(anchor_node)) ||
			!($isTextNode(focus_node) || $isTabNode(focus_node))
		) {
			return false
		}
		if (!event.altKey) {
			if (selection.isCollapsed()) {
				const code_node = anchor_node.getParentOrThrow()

				if (arrow_up && anchor_offset === 0 && anchor_node.getPreviousSibling() === null) {
					const prev_node = code_node.getPreviousSibling()

					if (prev_node === null) {
						code_node.selectPrevious()
						event.preventDefault()

						return true
					}
				} else if (
					!arrow_up &&
					anchor_offset === anchor_node.getTextContentSize() &&
					anchor_node.getNextSibling() === null
				) {
					const next_node = code_node.getNextSibling()

					if (next_node === null) {
						code_node.selectNext()
						event.preventDefault()

						return true
					}
				}
			}

			return false
		}

		let start: LexicalNode
		let end: LexicalNode

		if (anchor_node.isBefore(focus_node)) {
			start = getCodeNodeOfLine('first', anchor_node)
			end = getCodeNodeOfLine('last', focus_node)
		} else {
			start = getCodeNodeOfLine('first', focus_node)
			end = getCodeNodeOfLine('last', anchor_node)
		}

		if (start == null || end == null) return false

		const range = start.getNodesBetween(end)
		for (let i = 0; i < range.length; i++) {
			const node = range[i]

			if (!$isTextNode(node) && !$isTabNode(node) && !$isLineBreakNode(node)) return false
		}

		event.preventDefault()
		event.stopPropagation()

		const line_break = arrow_up ? start.getPreviousSibling() : end.getNextSibling()

		if (!$isLineBreakNode(line_break)) return true

		const sibling = arrow_up ? line_break.getPreviousSibling() : line_break.getNextSibling()

		if (!sibling) return true

		const line = arrow_up ? getCodeNodeOfLine('first', sibling) : getCodeNodeOfLine('last', sibling)
		const is_insertion_point = $isCodeNode(sibling) || $isTabNode(sibling) || $isLineBreakNode(sibling)

		let insertion_point = is_insertion_point ? line : sibling

		line_break.remove()

		range.forEach(node => node.remove())

		if (type === KEY_ARROW_UP_COMMAND) {
			range.forEach(node => insertion_point.insertBefore(node))

			insertion_point.insertBefore(line_break)
		} else {
			insertion_point.insertAfter(line_break)
			insertion_point = line_break

			range.forEach(node => {
				insertion_point.insertAfter(node)
				insertion_point = node
			})
		}

		selection.setTextNodeRange(anchor_node as TextNode, anchor_offset, focus_node as TextNode, focus_offset)

		return true
	}

	onMoveTo(type: LexicalCommand<KeyboardEvent>, event: KeyboardEvent) {
		const selection = $getSelection()

		if (!$isRangeSelection(selection)) {
			return false
		}

		const { anchor, focus } = selection
		const anchorNode = anchor.getNode()
		const focusNode = focus.getNode()
		const isMoveToStart = type === MOVE_TO_START

		if (
			!($isCodeNode(anchorNode) || $isTabNode(anchorNode)) ||
			!($isCodeNode(focusNode) || $isTabNode(focusNode))
		) {
			return false
		}

		if (isMoveToStart) {
			const start = this.getStartOfCodeInLine(focusNode as TextNode, focus.offset)

			if (start !== null) {
				const { node, offset } = start
				if ($isLineBreakNode(node)) {
					node.selectNext(0, 0)
				} else {
					selection.setTextNodeRange(node as TextNode, offset, node as TextNode, offset)
				}
			} else {
				focusNode.getParentOrThrow().selectStart()
			}
		} else {
			const node = getCodeNodeOfLine('last', focusNode) as CodeNode

			node.select()
		}

		event.preventDefault()
		event.stopPropagation()

		return true
	}

	register() {
		this.unregister = mergeRegister(
			this.editor.registerCommand(INSERT_CODE_COMMAND, this.insert, COMMAND_PRIORITY_EDITOR),
			this.editor.registerMutationListener(CodeNode, this.onMutation),
			this.editor.registerNodeTransform(CodeNode, this.transformCodeNode),
			this.editor.registerNodeTransform(TextNode, this.transformTextNode),
			this.editor.registerNodeTransform(LexicalTextNode, this.transformTextNode),
			this.editor.registerCommand(KEY_TAB_COMMAND, this.onTab, COMMAND_PRIORITY_LOW),
			this.editor.registerCommand(INSERT_TAB_COMMAND, this.onInsertTab, COMMAND_PRIORITY_LOW),
			this.editor.registerCommand(
				INDENT_CONTENT_COMMAND,
				_ => this.onMultilineIndent(INDENT_CONTENT_COMMAND),
				COMMAND_PRIORITY_LOW
			),
			this.editor.registerCommand(
				OUTDENT_CONTENT_COMMAND,
				_ => this.onMultilineIndent(OUTDENT_CONTENT_COMMAND),
				COMMAND_PRIORITY_LOW
			),
			this.editor.registerCommand(
				KEY_ARROW_UP_COMMAND,
				e => this.onShiftLines(KEY_ARROW_UP_COMMAND, e),
				COMMAND_PRIORITY_LOW
			),
			this.editor.registerCommand(
				KEY_ARROW_DOWN_COMMAND,
				e => this.onShiftLines(KEY_ARROW_DOWN_COMMAND, e),
				COMMAND_PRIORITY_LOW
			),
			this.editor.registerCommand(MOVE_TO_END, e => this.onMoveTo(MOVE_TO_END, e), COMMAND_PRIORITY_LOW),
			this.editor.registerCommand(MOVE_TO_START, e => this.onMoveTo(MOVE_TO_START, e), COMMAND_PRIORITY_LOW)
		)
	}

	off() {
		this.unregister()
	}
}
