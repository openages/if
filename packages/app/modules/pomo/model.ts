import { makeAutoObservable } from 'mobx'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { File } from '@/models'
import { getDocItem, id } from '@/utils'
import { disableWatcher } from '@/utils/decorators'
import { arrayMove } from '@dnd-kit/sortable'

import { getPomo, update } from './services'
import { fillTimeText, getGoingTime, getTime } from './utils'

import type { Subscription } from 'rxjs'
import type { Pomo } from '@/types'

@injectable()
export default class Index {
	id = ''
	data = {} as Pomo.Item

	watcher = null as unknown as Subscription
	disable_watcher = false

	view_index = 0
	view_direction = 0

	visible_edit_modal = false

	record_timer = null as unknown as NodeJS.Timer
	record_numbers = 0

	constructor(public file: File) {
		makeAutoObservable(
			this,
			{
				file: false,
				id: false,
				watcher: false,
				disable_watcher: false,
				record_timer: false,
				record_numbers: false
			},
			{ autoBind: true }
		)
	}

	init(args: { id: string }) {
		const { id } = args

		this.id = id
		this.file.init(id)

		this.on()
	}

	@disableWatcher
	async updatePomo(v?: Partial<Pomo.Item>) {
		await update(this.id, v ?? $copy(this.data))
	}

	@disableWatcher
	async toggleGoing(v?: boolean) {
		this.data.going = v ?? !this.data.going
		this.view_index = this.data.index

		if (this.data.going) {
			if (!this.data.current) this.data.current = 'work'

			this.startRecord()
		} else {
			this.stopRecord()
		}

		await this.updatePomo()
	}

	@disableWatcher
	async toggleContinuousMode() {
		this.data.continuous_mode = !this.data.continuous_mode

		await this.updatePomo()
	}

	@disableWatcher
	async add(v: Pomo.Session) {
		this.data.sessions.push({ ...v, id: id() })

		await this.updatePomo({ sessions: $copy(this.data.sessions) })
	}

	@disableWatcher
	async update(index: number, v: Pomo.Session) {
		this.data.sessions[index] = { ...this.data.sessions[index], ...v }

		if (this.data.index === index) {
			this.data.work_in = 0
			this.data.break_in = 0
		}

		await this.updatePomo({ sessions: $copy(this.data.sessions) })
	}

	@disableWatcher
	async remove(index: number) {
		if (this.data.sessions.length === 1) return
		if (this.view_index === index) this.view_index = 0

		this.data.sessions.splice(index, 1)

		await this.updatePomo({ sessions: $copy(this.data.sessions) })
	}

	@disableWatcher
	async move(active_index: number, over_index: number) {
		this.data.sessions = arrayMove($copy(this.data.sessions), active_index, over_index)

		this.data.current = null
		this.data.going = false
		this.data.work_in = 0
		this.data.break_in = 0
		this.data.index = 0

		await this.updatePomo()
	}

	@disableWatcher
	async next() {
		const session = this.data.sessions[this.data.index]

		const goNextSession = () => {
			const next_index = this.data.index + 1
			const next_session = this.data.sessions.at(next_index)

			if (!next_session) {
				this.data.index = 0
				this.view_index = 0

				return this.updatePomo()
			}

			this.data.index = next_index
			this.view_index = next_index
		}

		const reset = (current?: Index['data']['current']) => {
			this.data.current = current ?? null
			this.data.going = false
			this.data.work_in = 0
			this.data.break_in = 0
		}

		if (this.data.going) this.stopRecord()

		if (session.flow_mode) {
			reset()
			goNextSession()

			return
		}

		match(this.data.current)
			.with(null, () => {
				goNextSession()
			})
			.with('work', () => {
				reset('break')
			})
			.with('break', () => {
				reset()
				goNextSession()
			})

		this.updatePomo()
	}

	changeViewIndex(v: number | 'left' | 'right') {
		let view_direction = -1
		let view_index = -1

		if (typeof v === 'number') {
			view_direction = v - this.view_index > 0 ? 1 : -1
			view_index = v
		} else {
			view_direction = v === 'left' ? 1 : -1
			view_index = this.view_index + view_direction
		}

		if (view_index < 0 || view_index > this.data.sessions.length - 1) return

		this.view_direction = view_direction
		this.view_index = view_index
	}

	checkCurrent() {
		const session = this.data.sessions[this.data.index]

		if (session.flow_mode) {
			session.work_time = getGoingTime(this.data.work_in)

			const time = getTime(getGoingTime(this.data.work_in), true) as { hours: number; minutes: number }
			const percent = parseFloat(((time.minutes * 100) / 60).toFixed(2))

			$app.Event.emit('global.app.updateTimer', {
				in: { hours: fillTimeText(time.hours), minutes: fillTimeText(time.minutes) },
				percent
			})

			return
		}

		if (this.data.current === 'work') {
			const going_time = getGoingTime(this.data.work_in)
			const left_time = session.work_time - going_time
			const percent = parseFloat(((going_time * 100) / session.work_time).toFixed(2))

			$app.Event.emit('global.app.updateTimer', { in: getTime(left_time), percent })
		}

		if (this.data.current === 'break') {
			const going_time = getGoingTime(this.data.break_in)
			const left_time = session.break_time - going_time
			const percent = parseFloat(((going_time * 100) / session.break_time).toFixed(2))

			$app.Event.emit('global.app.updateTimer', { in: getTime(left_time), percent })
		}

		if (this.data.current === 'work' && getGoingTime(this.data.work_in) >= session.work_time) {
			this.data.current = 'break'

			this.stopRecord(true)
		}

		if (this.data.current === 'break' && getGoingTime(this.data.break_in) >= session.break_time) {
			this.data.current = null
			this.data.work_in = 0
			this.data.break_in = 0

			this.stopRecord(true)

			if (this.data.continuous_mode) {
				const next_index = this.data.index + 1
				const next_session = this.data.sessions.at(next_index)

				if (!next_session) return

				this.data.index = next_index

				return this.toggleGoing(true)
			}
		}
	}

	startRecord() {
		if (!this.data.current) return

		this.record_timer = setInterval(() => {
			this.record_numbers += 1

			if (this.data.current === 'work') {
				this.data.work_in += 1
			} else {
				this.data.break_in += 1
			}

			this.checkCurrent()

			if (this.record_numbers >= 9) {
				this.record_numbers = 0

				this.updatePomo()
			}
		}, 1000)
	}

	stopRecord(ignoreTimer?: boolean) {
		if (!this.record_timer) return

		if (!ignoreTimer) $app.Event.emit('global.app.updateTimer', null)

		clearInterval(this.record_timer)

		this.data.going = false

		this.updatePomo()
	}

	stopWatch() {
		if (!this.watcher) return

		this.watcher?.unsubscribe?.()
		this.watcher = null as unknown as Subscription
	}

	on() {
		this.stopWatch()

		this.watcher = getPomo(this.id).$.subscribe(doc => {
			if (this.disable_watcher) return

			if (!this.data.file_id) {
				this.data = getDocItem(doc!)!

				if (this.data.going) this.toggleGoing(true)
			}

			if (this.data.index !== this.view_index) {
				this.view_index = this.data.index
			}
		})

		$app.Event.on(`pomo/${this.id}/stopRecord`, this.stopRecord)
	}

	off() {
		this.file.off()

		$app.Event.off(`pomo/${this.id}/stopRecord`, this.stopRecord)

		this.stopWatch()
	}
}
