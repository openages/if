import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { SHOW_MODAL_COMMAND } from '@/Editor/commands'
import { Block } from '@/Editor/models'

import type KatexNode from './index'
import type { MouseEvent } from 'react'

@injectable()
export default class Index {
	constructor(public block: Block<KatexNode>) {
		makeAutoObservable(this, { block: false }, { autoBind: true })
	}

	onEdit(e: MouseEvent<HTMLSpanElement>) {
		this.block.onClick(e)
		this.block.editor.dispatchCommand(SHOW_MODAL_COMMAND, { type: 'Katex', node_key: this.block.key })
	}
}
