export default {
	migrating: '版本更新，数据迁移中，切勿关闭应用',
	free_mark: {
		title: '试用版',
		desc: '(¥3/月) 前往订阅'
	},
	search: {
		to_navigate: '切换',
		to_select: '选择',
		to_close: '关闭',
		history: '搜索历史'
	},
	screenlock: {
		set_password: `$t(common.set)$t(common.password)`,
		reset_password: `$t(common.reset)$t(common.password)`,
		copied: '$t(common.secret_key)$t(common.copied)',
		password_placeholder: '$t(common.input)$t(common.screenlock)$t(common.password)',
		generate_secret_key: '$t(common.generate)$t(common.secret_key)',
		secret_key_placeholder: '请输入生成的密钥',
		desc: '密钥可用来解锁和重置密码，请务必妥善保存',
		use_x_reset: '$t(common.use){{mode}}$t(common.reset)',
		lock: '锁定屏幕',
		lock_email_text: '发送上方请求码到下方邮箱，一至三个工作日内解锁码将发送到您的邮箱',
		lock_password_placeholder: '$t(common.input)$t(common.password)',
		unlock_placeholder: '输入解锁码',
		in_lock_mode: '已处于锁定模式',
		email_code_placeholder: '输入邮箱接收到的密钥',
		forget_password: '忘记密码',
		use_password: '使用密码'
	},
	ErrorBoundary: {
		title: '运行错误',
		desc: '程序发生了未知异常'
	}
}
