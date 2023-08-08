import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

@injectable()
export default class Index {
      loading = {} as Record<string, boolean>
      
	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
