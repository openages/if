import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'

import DividerNode from './plugins/Divider/Node'
import ImageNode from './plugins/Image/Node'
import KatexNode from './plugins/Katex/Node'

import type { Klass, LexicalNode } from 'lexical'

export default [
	ImageNode,
	KatexNode,
	DividerNode,
	AutoLinkNode,
	LinkNode,
	HeadingNode,
	QuoteNode,
	CodeNode,
	CodeHighlightNode,
	ListNode,
	ListItemNode
] as Array<Klass<LexicalNode>>
