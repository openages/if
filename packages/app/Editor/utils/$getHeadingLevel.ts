import type { HeadingNode } from '@lexical/rich-text'

export default (node: HeadingNode) => parseInt(node.getTag().replace('h', ''))
