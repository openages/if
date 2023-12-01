import { makeAutoObservable, toJS } from 'mobx'
import { injectable } from 'tsyringe'

import Utils from '@/models/utils'
import { arrayMove } from '@dnd-kit/sortable'
import { setStorageWhenChange } from '@openages/stk'

import type { App, DirTree } from '@/types'
import type { DragEndEvent } from '@dnd-kit/core'

@injectable()
export default class Index {
	stacks = [] as App.Stacks

	constructor(public utils: Utils) {
		makeAutoObservable(this, {}, { autoBind: true })

		this.utils.acts = [setStorageWhenChange(['stacks'], this)]
	}

	add(v: App.Stack) {
		const exsit_stack_index = this.stacks.findIndex(item => item.file.id === v.file.id)

		if (exsit_stack_index === -1) {
			const last_stack = this.stacks.at(-1)

			if (!last_stack || last_stack?.is_fixed) {
				this.stacks.push(v)
			} else {
				this.stacks.splice(this.stacks.length - 1, 1, v)
			}

			this.stacks.map(item => {
				item.is_active = false
			})

			this.stacks[this.stacks.length - 1].is_active = true
		} else {
			this.stacks.map(item => {
				item.is_active = false
			})

			this.stacks[exsit_stack_index].is_active = true
		}
	}

	remove(index: number) {
		this.stacks.splice(index, 1)

		const exsit_active = this.stacks.some(item => item.is_active)

		if (!exsit_active && this.stacks.length) {
			this.stacks[this.stacks.length - 1].is_active = true
		}
	}

	active(index: number) {
		this.stacks.map(item => {
			item.is_active = false
		})

		this.stacks[index].is_active = true
	}

	update({ index, v }: { index: number; v: Partial<App.Stack> }) {
		this.stacks[index] = { ...this.stacks[index], ...v }
	}

	updateFile(v: DirTree.Item) {
		const index = this.stacks.findIndex(item => item.id === v.id)

		if (index === -1) return

		this.stacks[index] = {
			...this.stacks[index],
			id: v.id,
			file: v
		}
	}

	removeFile(id: string) {
		this.stacks = this.stacks.filter(item => item.id !== id)
	}

	move({ active, over }: DragEndEvent) {
		if (!over?.id) return false
		if (active.id === over.id) return

		const active_item = this.stacks[active.data.current.index as number]

		if (!active_item.is_fixed) {
			active_item.is_fixed = true
		}

		this.stacks = arrayMove(
			toJS(this.stacks),
			active.data.current.index as number,
			over.data.current.index as number
		)
	}

	off() {
		this.utils.off()
	}
}
