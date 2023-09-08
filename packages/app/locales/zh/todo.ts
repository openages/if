export default {
	default_angles: ['此刻', '计划', '想法', '等待', '循环', '垃圾箱'],
	Header: {
		edit: '编辑',
		reference: '参考资料',
		archive: '归档'
	},
	SettingsModal: {
		desc: {
			label: '简介',
			placeholder: '关于todo的简单描述'
		},
		angles: {
			label: '分类',
			placeholder: 'todo list内部的分类',
			remove_confirm: {
				title: '注意',
				content: '您正在进行分类删除操作，这将删除该分类下的所有待办项，请确认是否执行删除。'
			}
		},
		tags: {
			label: '标签',
			placeholder: '标签名'
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
			title: '组'
		},
		Circle: {
			title: '任务循环周期',
			day: '天数',
			hour: '小时',
			minute: '分钟'
		}
	}
}
