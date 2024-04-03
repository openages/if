export default {
	migrating: 'Version updated, data Migrating, don`t close.',
	free_mark: {
		title: 'Trial Version',
		desc: 'Go to subscribe'
	},
	search: {
		to_navigate: 'to navigate',
		to_select: 'to select',
		to_close: 'to close',
		history: 'Search history'
	},
	screenlock: {
		set_password: `$t(common.set) $t(common.password)`,
		reset_password: `$t(common.reset) $t(common.password)`,
		copied: '$t(common.secret_key) $t(common.copied)',
		password_placeholder: '$t(common.input) $t(common.screenlock) $t(common.password)',
		generate_secret_key: '$t(common.generate) $t(common.secret_key)',
		secret_key_placeholder: 'Please input secret key',
		desc: 'Secret key can be used to unlock and reset the password, please be sure to keep it secure.',
		use_x_reset: '$t(common.use) {{mode}} $t(common.reset)',
		lock: 'Lock Screen',
		lock_email_text:
			'Send the request code above to the email below. The unlocking code will be sent to your email within one to three business days.',
		lock_password_placeholder: '$t(common.input) $t(common.password)',
		unlock_placeholder: 'Enter the unlock code',
		in_lock_mode: 'In lock mode',
		email_code_placeholder: 'Enter the key received in your email',
		forget_password: 'Forget Password',
		use_password: 'Using Password'
	},
	ErrorBoundary: {
		title: 'Something Error',
		desc: 'App encountered unexpected exception'
	}
}
