import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import type { IReactionDisposer, Lambda } from 'mobx'

@injectable()
export default class Utils {
	acts = [] as Array<IReactionDisposer | Lambda>
	loading = {} as Record<string, boolean>

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	off() {
		this.acts.map((item) => item())
	}
}
