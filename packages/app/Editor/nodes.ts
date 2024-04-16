import { AutoLinkNode, LinkNode } from '@lexical/link'

import ImageNode from './plugins/Image/Node'

import type { Klass, LexicalNode } from 'lexical'

export default [AutoLinkNode, LinkNode, ImageNode] as Array<Klass<LexicalNode>>
