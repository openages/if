import to from 'await-to-js'
import { omit } from 'lodash-es'
import lz from 'lz-string'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { getVersionName } from '@/appdata'
import Utils from '@/models/utils'
import { getUserData, ipc, trpc } from '@/utils'
import { loading } from '@/utils/decorators'
import { local } from '@openages/stk/storage'

import type { Trpc } from '@/types'

@injectable()
export default class Index {
	sign_type = 'signin' as 'signin' | 'signup'
	user = { paid_plan: 'free', is_infinity: false } as Trpc.UserData
	temp_user = {} as Trpc.UserData
	edit_mode = false

	constructor(public utils: Utils) {
		makeAutoObservable(this, { utils: false }, { autoBind: true })
	}

	init() {
		const user = getUserData()

		if (user) this.user = user

		this.getProductList()
	}

	async getProductList() {
		const res = await ipc.auth.getProductList.mutate()
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
		const [err] = await to(trpc.auth.sendVerifyCode.mutate({ email }))

		if (err) return

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
	}

	afterSign(data: Trpc.ResSign) {
		const { token } = data
		const user = omit(data, 'token') as Trpc.UserData

		local.token = token

		this.saveUser(user)
	}

	saveUser(v: Index['user']) {
		this.user = v

		local.user = lz.compress(JSON.stringify(v))
	}

	off() {
		this.utils.off()
	}
}
