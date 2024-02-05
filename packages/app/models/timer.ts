import { makeAutoObservable } from 'mobx'

export default class Index {
	timer = null as { in: { hours: string; minutes: string }; percent: number } | null

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init() {
		this.on()
	}

	hasTimer() {
		return this.timer !== null
	}

	updateTimer(v: Index['timer']) {
		this.timer = v
	}

	on() {
		$app.Event.on('global.app.hasTimer', this.hasTimer)
		$app.Event.on('global.app.updateTimer', this.updateTimer)
	}

	off() {
		$app.Event.off('global.app.hasTimer', this.hasTimer)
		$app.Event.off('global.app.updateTimer', this.updateTimer)
	}
}
