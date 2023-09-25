import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import type { IReactionDisposer } from 'mobx'

@injectable()
export default class Utils {
	acts = [] as Array<IReactionDisposer>
	loading = {} as Record<string, boolean>

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	off() {
		this.acts.map((item) => item())
	}
}
