import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import type { Type } from './types'

@injectable()
export default class Index {
	modal_open = false
	modal_type = 'file' as Type
	fold_all = false

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
