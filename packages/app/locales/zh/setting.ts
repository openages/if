export default {
	nav: {
		titles: {
			Global: '全局设置',
			Account: '账号信息',
			Paid: '付费计划',
			Menu: '菜单设置',
			Tasks: '任务管理器',
			Shortcuts: '快捷键',
			About: '关于'
		}
	},
	Normal: {
		title: '设置',
		language: {
			title: '语言',
			desc: '应用所使用的语言'
		},
		theme: {
			title: '主题',
			desc: '应用主题色、组件颜色',
			options: {
				light: '浅色',
				dark: '深色'
			},
			auto_theme: '自动切换主题，6点到18点浅色主题，其余时间深色主题'
		},
		show_bar_title: {
			title: '导航栏标题',
			desc: '显示导航图标下方的标题',
			options: {
				hide: '隐藏',
				show: '显示'
			}
		},
		page_width: {
			title: '页面宽度',
			desc: '内容页面的宽度规则',
			options: {
				unlimited: '全部',
				limited: '固定'
			}
		}
	},
	NavItems: {
		title: '功能项'
	},
	ColorSelector: {
		title: '主题色'
	},
	Screenlock: {
		title: '锁屏',
		password: {
			title: '密码',
			desc: '设定应用锁屏密码'
		},
		autolock: {
			title: '自动锁屏',
			desc: '不活跃时锁定屏幕'
		},
		getFingerprint: {
			error: '指纹生成失败，请联系开发商'
		}
	},
	Paid: {
		desc_wrap: {
			text: '订阅将自动续费，可随时取消。成功购买后若用户计划未更新，可尝试',
			restore_purchase: '恢复购买',
			privacy: '隐私政策',
			terms: '使用条款'
		},
		file: '文件',
		unit: '月',
		unlimited: '无限',
		common: {
			'0': '黑暗模式',
			'1': '锁屏',
			'2': '多主题色',
			'3': '导入导出Markdown'
		},
		free: {
			type: '免费者',
			btn_text: '给个好评'
		},
		pro: {
			type: '专业者',
			value: '¥3',
			btn_text: '成为专业者'
		},
		sponsor: {
			type: '赞助者',
			value: '¥600',
			title_rights: '您将具备以下特权：',
			rights: {
				'0': '在IF官网首页展示您的Logo和链接网址',
				'1': '在IF App设置页展示您的Logo和链接网址',
				'2': '与开发团队一对一沟通，并参与产品改进的机会'
			},
			title_steps: '按照如下步骤成为赞助者：',
			steps: {
				'0': '在IF内打开设置界面，点击界面左下角进入付费',
				'1': '如果您未注册账号，将提示付费需注册账号',
				'2': '账号注册完成之后点击选择赞助者付费计划进行付款',
				'3': '付款完成后在设置中的用户界面复制您的uid',
				'4': '发送您的uid, logo和具备安全内容的链接到 sponsor@openages.com',
				'5': '15天之后您的logo和链接网址将会展示在官网和App内'
			},
			btn_text: '成为赞助者',
			extra: '限量60个席位，该项付费不支持退款。'
		},
		infinity: {
			type: '永久使用者',
			extra: '永久使用者包含专业者的所有功能，并永久免费使用。永久使用者仅可通过参加KOL/KOC计划获得。',
			join: '加入'
		},
		login: 'IF使用Apple服务端API验证您的订阅状态，以实现订阅状态的跨平台同步。这要求您在订阅前使用邮箱进行注册和登录，您的邮箱将仅用于登录，前往注册/登录？'
	},
	Note: {
		serif: {
			title: '衬线字体',
			desc: '衬线字体有易读、专业、可识别等优点'
		},
		small_text: {
			title: '小字号',
			desc: '更好的字号以展示更多内容'
		},
		toc: {
			title: '大纲模式',
			desc: '大纲用于总览文章结构',
			options: ['默认', '常亮', '最小化', '隐藏']
		},
		count: {
			title: '字数统计',
			desc: '统计全文字数，不包含空格'
		},
		batch_import: {
			desc: '批量导入Markdown文件'
		}
	},
	User: {
		free: {
			title: '免费用户',
			desc: '有使用限制'
		},
		pro: {
			title: '专业用户',
			desc: '无功能限制'
		},
		infinity: {
			title: '永久',
			desc: '全功能'
		},
		max: {
			title: '高级用户',
			desc: '畅享云服务'
		},
		sponsor: {
			title: '赞助者',
			desc: '用户席位'
		},
		gold_sponsor: {
			title: '金牌赞助商',
			desc: '一对一支持'
		},
		team: {
			title: '团队用户',
			desc: '支持团队协作'
		}
	}
}
