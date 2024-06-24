export default {
	nav: {
		titles: {
			Global: '全局设置',
			Menu: '菜单设置',
			Tasks: '任务管理器',
			Shortcuts: '快捷键'
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
		}
	}
}
