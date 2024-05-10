import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'

import CodeNode from './plugins/Code/CodeNode'
import CodeTextNode from './plugins/Code/CodeTextNode'
import DividerNode from './plugins/Divider/Node'
import ImageNode from './plugins/Image/Node'
import KatexNode from './plugins/Katex/Node'
import ToggleBodyNode from './plugins/Toggle/ToggleBodyNode'
import ToggleHeadNode from './plugins/Toggle/ToggleHeadNode'
import ToggleNode from './plugins/Toggle/ToggleNode'

import type { Klass, LexicalNode } from 'lexical'

export default [
	ImageNode,
	KatexNode,
	DividerNode,
	CodeNode,
	CodeTextNode,
	ToggleNode,
	ToggleHeadNode,
	ToggleBodyNode,

	AutoLinkNode,
	LinkNode,
	HeadingNode,
	QuoteNode,
	ListNode,
	ListItemNode
] as Array<Klass<LexicalNode>>
