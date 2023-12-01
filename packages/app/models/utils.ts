import { makeAutoObservable } from 'mobx'

import type { IReactionDisposer, Lambda } from 'mobx'

export default class Utils {
	acts = [] as Array<IReactionDisposer | Lambda>
	loading = {} as Record<string, boolean>

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	off() {
		this.acts.map(item => item())
	}
}
