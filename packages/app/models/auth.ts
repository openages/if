import to from 'await-to-js'
import { omit } from 'lodash-es'
import lz from 'lz-string'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { getVersionName } from '@/appdata'
import Utils from '@/models/utils'
import { getUserData, hono, ipc, is_electron_shell, trpc } from '@/utils'
import { loading } from '@/utils/decorators'
import { setStorageWhenChange } from '@openages/stk/mobx'
import { local } from '@openages/stk/storage'

import type { Trpc } from '@/types'

const user_preset = { paid_plan: 'free', is_infinity: false } as Trpc.UserData

@injectable()
export default class Index {
	sign_type = 'signin' as 'signin' | 'signup'
	user = user_preset
	temp_user = {} as Trpc.UserData
	edit_mode = false
	frozen = false
	test_status = 'untest' as 'untest' | 'testing' | 'ok' | 'error'

	constructor(public utils: Utils) {
		makeAutoObservable(this, { utils: false }, { autoBind: true })
	}

	init() {
		this.utils.acts = [setStorageWhenChange(['frozen'], this, { useSession: true })]

		const user = getUserData()

		if (user) {
			this.user = user
		} else {
			this.test(true)
		}

		this.on()
		if (is_electron_shell) this.onVerify()
	}

	onVerify() {
		ipc.iap.onVerify.subscribe(undefined, {
			onData: v => {
				if (this.user.id && this.user.paid_plan !== 'free') {
					this.frozen = v
				} else {
					this.frozen = false
				}
			}
		})
	}

	async updateUser() {
		if (!Object.keys(this.temp_user).length) return

		if (this.temp_user.name === '') this.temp_user.name = getVersionName()

		const [err, res] = await to(trpc.user.update.mutate({ ...this.temp_user, id: this.user.id }))

		this.edit_mode = false

		if (err) return $message.error($t('common.save_failed'))
		if (res.error) return $message.error($t(`app.auth.${res.error}`))

		const { data } = res

		this.saveUser({ ...this.user, ...data })
	}

	@loading
	async sendVerifyCode(email: string) {
		const [err, res] = await to(trpc.auth.sendVerifyCode.mutate({ mid: local.mid, email }))

		if (err) return

		if (res.error) {
			$message.error($t(`app.auth.${res.error}`))

			return false
		}

		$message.success($t('app.auth.send_captcha_done'))
	}

	@loading
	async signup(args: Trpc.Input['auth']['signup']) {
		const [err, res] = await to(trpc.auth.signup.mutate(args))

		if (err) return
		if (res.error) return $message.error($t(`app.auth.${res.error}`))

		$message.success($t('app.auth.signup_success'))

		this.afterSign(res.data as Trpc.ResSign)
	}

	@loading
	async signin(args: Trpc.Input['auth']['signin']) {
		const [err, res] = await to(trpc.auth.signin.mutate(args))

		if (err) return
		if (res.error) return $message.error($t(`app.auth.${res.error}`))

		$message.success($t('app.auth.signin_success'))

		this.afterSign(res.data as Trpc.ResSign)
	}

	@loading
	async activate(activation_code: string) {
		if (!activation_code) return

		const [err, res] = await to(
			trpc.auth.activate.mutate({
				id: this.user.id,
				activation_code,
				refresh_token: this.user.refresh_token
			})
		)

		if (err) return
		if (res.error) return $message.error($t(`app.auth.${res.error}`))

		$message.success($t('app.auth.signin_success'))

		this.afterSign(res.data as Trpc.ResSign)
	}

	async signout() {
		const [err, res] = await to(trpc.auth.signout.mutate({ mid: local.mid, id: this.user.id }))

		if (err) return
		if (res.error) return $message.error($t(`app.auth.${res.error}`))

		this.user = { paid_plan: 'free', is_infinity: false } as Trpc.UserData

		local.removeItem('token')
		local.removeItem('user')

		$app.Event.emit('global.iap.afterOnlocal')
	}

	async shutdown() {
		const [err, res] = await to(trpc.auth.shutdown.mutate({ id: this.user.id }))

		if (err) return
		if (res.error) return $message.error($t(`app.auth.${res.error}`))

		this.user = { paid_plan: 'free', is_infinity: false } as Trpc.UserData

		local.removeItem('token')
		local.removeItem('user')
	}

	async test(ignore_message?: boolean) {
		let close = null

		if (!ignore_message) close = $message.loading($t('app.auth.test_title'), 30)

		this.test_status = 'testing'

		const [err_raw] = await to(hono.test.$get())

		close?.()

		if (err_raw) {
			if (!ignore_message) $message.error($t('app.auth.test_failed'), 24)

			return (this.test_status = 'error')
		}

		this.test_status = 'ok'

		if (!ignore_message) $message.success($t('app.auth.test_ok'))
	}

	afterSign(data: Trpc.ResSign) {
		const { token } = data
		const user = omit(data, 'token') as Trpc.UserData

		local.token = token

		this.saveUser(user)

		$app.Event.emit('global.iap.afterSign')
	}

	saveUser(v: Partial<Index['user']>) {
		this.user = { ...this.user, ...v }

		local.user = lz.compress(JSON.stringify(this.user))
	}

	resetUser() {
		this.user = user_preset
	}

	on() {
		$app.Event.on('global.auth.saveUser', this.saveUser)
		$app.Event.on('global.auth.resetUser', this.resetUser)
	}

	off() {
		this.utils.off()

		$app.Event.off('global.auth.saveUser', this.saveUser)
		$app.Event.off('global.auth.resetUser', this.resetUser)
	}
}
