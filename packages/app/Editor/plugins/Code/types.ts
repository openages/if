import type { SerializedElementNode, SerializedTextNode as _SerializedTextNode, Spread } from 'lexical'

import type { BundledLanguage } from 'shiki'

export interface IPropsCode {
	value: string
	lang?: BundledLanguage
	node_key?: string
}

export interface IPropsText {
	text: string
	styles?: string
	node_key?: string
}

export type SerializedCodeNode = Spread<IPropsCode, SerializedElementNode>
export type SerializedTextNode = Spread<IPropsText, _SerializedTextNode>
