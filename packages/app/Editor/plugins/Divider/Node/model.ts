import { makeObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Block } from '@/Editor/models'

@injectable()
export default class Index {
	constructor(public block: Block) {
		makeObservable(this, {}, { autoBind: true })
	}
}
