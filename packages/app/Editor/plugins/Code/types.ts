import type { SerializedLexicalNode, Spread } from 'lexical'

import type CodeNode from './Node'
import type { BundledLanguage } from 'shiki'
import type Model from './Node/model'

export interface IPropsCode {
	value: string
	lang?: BundledLanguage
	node_key?: string
}

export interface IPropsComponent extends IPropsCode {
	node: CodeNode
}

export interface IPropsRender extends IPropsCode {
	onClick?: () => void
}

export type SerializedCodeNode = Spread<IPropsCode, SerializedLexicalNode>

export interface IPropsShadow {
	signal: Model['signal_html']
	html: Model['html']
}

export interface IPropsTextarea {
	source: Model['source']
	onInput: Model['onInput']
	onKeyDown: Model['onKeyDown']
}
