import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'

import ImageNode from './plugins/Image/Node'
import KatexNode from './plugins/Katex/Node'

import type { Klass, LexicalNode } from 'lexical'

export default [
	ImageNode,
	KatexNode,
	HorizontalRuleNode,
	AutoLinkNode,
	LinkNode,
	HeadingNode,
	QuoteNode,
	CodeNode,
	CodeHighlightNode,
	ListNode,
	ListItemNode
] as Array<Klass<LexicalNode>>

// floating-text-format-popup
