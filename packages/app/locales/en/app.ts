export default {
	migrating: 'Version updated, data Migrating, don`t close.',
	auth: {
		signup: 'Signup',
		signin: 'Signin',
		confirm_password: 'Confirm Password',
		confirm_password_error: 'Confirm password do not match',
		send_captcha: 'Send Captcha',
		resend_captcha: '{{time}}s resend',
		send_captcha_done: 'Captcha has been sent to your email',
		confirm: 'The free usage limit has been reached. Go to subscribe?',
		not_login: 'Login has expired, please relogin!',
		email_not_input: 'No email entered',
		send_verify_code_error: 'Failed to retrieve the verification code',
		mid_exist: 'This device has already registered an account and cannot be registered again',
		email_exist: 'This email has already registered an account and cannot be registered again',
		verify_code_error: 'Incorrect verification code',
		db_insert_error: 'Failed to add user to the database',
		db_update_error: 'Database failed to update user',
		signup_success: 'Signup Success',
		user_not_exist: 'User does not exist',
		verify_password_error: 'Incorrect password',
		signin_success: 'Signin Success',
		token_error: 'Signin token verification failed, please log in again',
		refresh_token_error: 'Signin token refresh token verification failed, please log in again',
		activation_code_not_exist: 'Activation code does not exist',
		activation_code_expired: 'Activation code has expired',
		activation_code_user_not_match: 'Activation Code User Not Match',
		activation_code_used: 'Activation code has been used',
		slider_captcha: {
			default: 'Drag to complete the puzzle',
			loading: 'Loading...',
			verifying: 'Verifying',
			error: 'Failed'
		},
		signout: 'Signout',
		activate: 'activate',
		activate_code: 'Activate Code',
		activate_success: 'Activate Success'
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
