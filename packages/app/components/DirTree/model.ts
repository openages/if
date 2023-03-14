import { makeAutoObservable } from 'mobx'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import Services from './services'

import type { DirTree } from '@/types'

@injectable()
export default class Index {
	current_item = ''
	modal_type = 'file' as DirTree.Type
	fold_all = false

	constructor(public services: Services) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	onOptions(type: 'rename' | 'delete') {
		const _this = this

		match(type)
			.with('rename', () => {})
			.with('delete', () => {
				$modal.confirm({
					title: `确认删除当前${this.services.focusing_item.type === 'dir' ? '组' : '列表'}`,
					onOk() {
						_this.services.delete()
					}
				})
			})
			.exhaustive()
	}
}
