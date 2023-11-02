export default {
	common: {
		status: {
			unchecked: '未完成',
			checked: '已完成',
			closed: '已关闭'
		},
		star: '重要性'
	},
	context_menu: {
		detail: '查看详情',
		insert: '添加',
		add_tags: '添加标签',
		insert_children: '添加子任务',
		move: '移动到',
		remove: '删除',
		move_into: '移为子任务',
		move_out: '移为一级'
	},
	default_angles: ['此刻', '计划', '想法', '等待', '循环', '垃圾箱'],
	Header: {
		related: {
			reference: '参考资料',
			todograph: '任务规划'
		},
		archive: '归档',
		options: {
			edit: '编辑',
			sort: {
				text: '排序',
				importance: '重要性',
				alphabetical: '字母顺序',
				create_at: '创建时间'
			},
			tags: '标签'
		}
	},
	SettingsModal: {
		desc: {
			label: '简介',
			placeholder: '关于todo的简单描述'
		},
		angles: {
			label: '分类',
			placeholder: 'todo list内部的分类',
			remove_confirm: '你将删除该分类下的{{counts}}个待办项，请确认是否执行删除。'
		},
		tags: {
			label: '标签',
			placeholder: '标签名',
			remove_confirm: '该标签下有{{counts}}个待办项，不可删除（未关联任何待办的标签可删除）。'
		},
		auto_archiving: {
			label: '自动归档',
			options: {
				'0m': '立刻',
				'3m': '3分钟',
				'3h': '3小时',
				'1d': '1天',
				'3d': '3天',
				'7d': '一周'
			}
		}
	},
	Input: {
		placeholder: '添加待办',
		tag_placeholder: '标签',
		type: {
			todo: '待办',
			group: '组'
		},
		Circle: {
			title: '重复',
			day: '天数',
			hour: '小时',
			minute: '分钟',
			disabled: '未开启',
			unset: '未设置'
		}
	},
	Archive: {
		title: '归档',
		end: '到底了',
		restore: '恢复',
		remove: '删除',
		clean: {
			title: '清档：',
			placeholder: '选择日期',
			options: {
				'1year': '一年前',
				'6month': '六个月前',
				'3month': '三个月前',
				'1month': '一个月前',
				'15days': '十五天前',
				'1week': '一周前'
			},
			total: '共{{counts}}条记录'
		},
		confirm: '你将删除{{date}}前的所有归档，请确认是否删除？',
		filter: {
			select: '选择',
			angle: '分类',
			tags: '标签',
			date: '日期',
			begin: '起始',
			end: '截止',
			status: '状态'
		}
	},
	Detail: {
		title: '任务详情'
	}
}
