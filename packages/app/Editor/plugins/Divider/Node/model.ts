import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Block } from '@/Editor/models'

import type KatexNode from './index'

@injectable()
export default class Index {
	constructor(public block: Block<KatexNode>) {
		makeAutoObservable(this, { block: false }, { autoBind: true })
	}
}
