/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
	EditorConfig,
	EditorThemeClasses,
	LexicalNode,
	LineBreakNode,
	NodeKey,
	SerializedTextNode,
	Spread,
	TabNode
} from 'lexical'

import { $applyNodeReplacement, $isTabNode, TextNode } from 'lexical'

import { addClassNamesToElement, removeClassNamesFromElement } from '@lexical/utils'

type SerializedCodeHighlightNode = Spread<
	{
		color: string | null | undefined
	},
	SerializedTextNode
>

/** @noInheritDoc */
export class CodeHighlightNode extends TextNode {
	__color: string | null | undefined

	constructor(text: string, color?: string | null | undefined, key?: NodeKey) {
		super(text, key)
		this.__color = color
	}

	static getType(): string {
		return 'code-highlight'
	}

	static clone(node: CodeHighlightNode): CodeHighlightNode {
		return new CodeHighlightNode(node.__text, node.__color || undefined, node.__key)
	}

	getHighlightType(): string | null | undefined {
		const self = this.getLatest()
		return self.__color
	}

	canHaveFormat(): boolean {
		return false
	}

	createDOM(config: EditorConfig): HTMLElement {
		const element = super.createDOM(config)

		element.style.color = this.__color

		return element
	}

	updateDOM(prevNode: CodeHighlightNode, dom: HTMLElement, config: EditorConfig): boolean {
		const update = super.updateDOM(prevNode, dom, config)
		const prevClassName = getHighlightThemeClass(config.theme, prevNode.__color)
		const nextClassName = getHighlightThemeClass(config.theme, this.__color)
		if (prevClassName !== nextClassName) {
			if (prevClassName) {
				removeClassNamesFromElement(dom, prevClassName)
			}
			if (nextClassName) {
				addClassNamesToElement(dom, nextClassName)
			}
		}
		return update
	}

	static importJSON(serializedNode: SerializedCodeHighlightNode): CodeHighlightNode {
		const node = $createCodeHighlightNode(serializedNode.text, serializedNode.color)
		node.setFormat(serializedNode.format)
		node.setDetail(serializedNode.detail)
		node.setMode(serializedNode.mode)
		node.setStyle(serializedNode.style)
		return node
	}

	exportJSON(): SerializedCodeHighlightNode {
		return {
			...super.exportJSON(),
			color: this.getHighlightType(),
			type: 'code-highlight',
			version: 1
		}
	}

	// Prevent formatting (bold, underline, etc)
	setFormat(format: number): this {
		return this
	}

	isParentRequired(): true {
		return true
	}
}

function getHighlightThemeClass(
	theme: EditorThemeClasses,
	color: string | null | undefined
): string | null | undefined {
	return color && theme && theme.codeHighlight && theme.codeHighlight[color]
}

export function $createCodeHighlightNode(text: string, color?: string | null | undefined): CodeHighlightNode {
	return $applyNodeReplacement(new CodeHighlightNode(text, color))
}

export function $isCodeHighlightNode(
	node: LexicalNode | CodeHighlightNode | null | undefined
): node is CodeHighlightNode {
	return node instanceof CodeHighlightNode
}

export function getFirstCodeNodeOfLine(anchor: LexicalNode) {
	let previousNode = anchor
	let node: null | LexicalNode = anchor
	while ($isCodeHighlightNode(node) || $isTabNode(node)) {
		previousNode = node
		node = node.getPreviousSibling()
	}

	return previousNode
}

export function getLastCodeNodeOfLine(anchor: LexicalNode) {
	let nextNode = anchor
	let node: null | LexicalNode = anchor
	while ($isCodeHighlightNode(node) || $isTabNode(node)) {
		nextNode = node
		node = node.getNextSibling()
	}
	return nextNode
}
