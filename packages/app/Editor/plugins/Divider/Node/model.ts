import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Block } from '@/Editor/models'

@injectable()
export default class Index {
	constructor(public block: Block) {
		makeAutoObservable(this, { block: false }, { autoBind: true })
	}
}
