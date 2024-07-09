import type { SerializedLexicalNode, Spread } from 'lexical'

export type SerializedNavigationNode = Spread<{node_key?:string}, SerializedLexicalNode>
