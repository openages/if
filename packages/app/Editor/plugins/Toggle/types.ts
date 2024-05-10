import type { SerializedElementNode, Spread } from 'lexical'

export interface IPropsToggle {
	open?: boolean
	node_key?: string
}

export type SerializedToggleNode = Spread<IPropsToggle, SerializedElementNode>
