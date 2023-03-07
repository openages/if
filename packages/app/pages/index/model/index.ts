import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import type { TodoItem } from '../types'
import type { DirTreeActiveItem } from '@/components'

@injectable()
export default class Index {
	active_item = {} as DirTreeActiveItem
	info = {
		name: 'EPC',
		desc: 'EPC（Engineering Procurement Construction），是指承包方受业主委托，按照合同约定对工程建设项目的设计、采购、施工等实行全过程或若干阶段的总承包'
	}
	tabs = ['Now', 'Plan', 'Idea', 'Wait', 'Circle', 'Trashbox']
	active_tab_index = 0
	todo_items: Array<TodoItem> = [
		{
			id: 0,
			type: 'todo',
			text: '基于tensorflow训练“边缘AI” 个性化用户服务 AI助手 “小义（Yi）”',
			status: 'unchecked',
			checked_point: 0
		},
		{
			id: 1,
			type: 'todo',
			text: '搜索支持添加到右下角全局options区域',
			status: 'unchecked',
			checked_point: 0
		},
		{
			id: 2,
			type: 'todo',
			text: '支持桌面小窗口一直在前，显示当前todo列表',
			status: 'unchecked',
			checked_point: 0
		},
		{
			id: 3,
			type: 'group',
			title: '上午',
			children: [
				{
					id: 4,
					type: 'todo',
					text: '起床洗漱',
					status: 'checked',
					checked_point: 0
				},
				{
					id: 5,
					type: 'todo',
					text: '喂猫',
					status: 'checked',
					checked_point: 0
				},
				{
					id: 6,
					type: 'todo',
					text: '做饭',
					status: 'unchecked',
					checked_point: 0
				}
			]
		},
		{
			id: 7,
			type: 'group',
			title: '下午',
			children: [
				{
					id: 8,
					type: 'todo',
					text: '打扫屋子',
					status: 'unchecked',
					checked_point: 0
				},
				{
					id: 9,
					type: 'todo',
					text: '洗衣服',
					status: 'unchecked',
					checked_point: 0
				},
				{
					id: 10,
					type: 'todo',
					text: '洗澡',
					status: 'unchecked',
					checked_point: 0
				}
			]
            },
	]

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	setActiveTabIndex(v: Index['active_tab_index']) {
		this.active_tab_index = v
	}
}
