import { MessageType } from 'antd/es/message/interface'
import to from 'await-to-js'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { paddle } from '@/appdata/pay'
import Utils from '@/models/utils'
import { conf, getUserData, hono, ipc, is_mas_id, trpc } from '@/utils'
import { loading } from '@/utils/decorators'
import { initializePaddle } from '@paddle/paddle-js'

import type { Iap } from '@/types'

import type { Paddle } from '@paddle/paddle-js'

@injectable()
export default class Index {
	data = {} as { tid: string; receipt_url: string }
	type = 'pro' as 'pro' | 'infinity'
	paddle = null as unknown as Paddle
	prices = {} as Record<Iap.Plan, string>

	constructor(public utils: Utils) {
		makeAutoObservable(this, { utils: false, paddle: false }, { autoBind: true })
	}

	init() {
		this.initPaddle()
	}

	async initPaddle() {
		const res = await initializePaddle({
			environment: 'sandbox',
			token: 'test_42487f9c268654736359e895d17'
		})

		if (!res) return

		this.paddle = res

		this.getPrices()
	}

	async getPrices() {
		const { data } = await this.paddle.PricePreview({
			items: [
				{ priceId: paddle.sandbox.price_id.pro, quantity: 1 },
				{ priceId: paddle.sandbox.price_id.infinity, quantity: 1 }
			]
		})

		this.prices = {
			pro: data.details.lineItems[0].formattedTotals.subtotal,
			infinity: data.details.lineItems[1].formattedTotals.subtotal
		}
	}

	async upgrade() {
		const user = getUserData()

		if (!user?.id) {
			$app.Event.emit('global.setting.goLogin')

			return $message.info($t('app.not_login'))
		}

		this.paddle.Checkout.open({
			items: [{ priceId: paddle.sandbox.price_id[this.type], quantity: 1 }],
			customData: { type: this.type, user_id: user.id }
		})
	}

	async cancelBilling() {
		// 弹窗提示发送退款请求到support.if@openages.com
	}

	async cancelSubscription() {
		this.paddle.Retain.initCancellationFlow({
			subscriptionId: ''
		})
	}

	async verify() {
		const user = getUserData()

		if (!user?.id) return

		const res_test = await this.test(true)

		if (res_test !== true) return

		const [err, res] = await to(trpc.iap.verifyReceipt.mutate({ id: user.id }))

		if (err || res.error !== null) return

		const data = res.data

		if (res.data) $app.Event.emit('global.auth.saveUser', data)

		ipc.iap.verify.mutate(data || { paid_plan: 'free' })
	}

	@loading
	async purchase(id: string) {
		const res_test = await this.test()

		if (res_test !== true) return

		await conf.set('oniap', true)

		const res = await ipc.iap.purchase.mutate({ id })

		if (res.error !== null || !res.ok) {
			return $message.error(res.error)
		}

		$app.Event.emit('app/setLoading', { visible: true, desc: $t('iap.state.purchasing'), showClose: true })
	}

	async restore() {
		const res_test = await this.test()

		if (res_test !== true) return

		await conf.set('oniap', true)

		await ipc.iap.restore.query()

		$app.Event.emit('app/setLoading', { visible: true, desc: $t('iap.state.restoring'), showClose: true })
	}

	async afterPurchase(args: { tid: string; receipt_url: string }) {
		const { tid, receipt_url } = args

		const user = getUserData()

		if (!user?.id) {
			this.data = args

			this.afterOnlocal()

			return
		}

		const { id, refresh_token } = user

		const [err_update, res_update] = await to(
			trpc.iap.updateReceipt.mutate({ id, refresh_token, tid, receipt_url })
		)

		if (err_update || res_update.error !== null) return $message.error($t('iap.error'), 60)

		const [err_verify, res_verify] = await to(trpc.iap.verifyReceipt.mutate({ id, after_update: true }))

		if (err_verify || res_verify.error !== null) return $message.error($t('iap.error'), 60)

		const data = res_verify.data!

		$app.Event.emit('global.auth.saveUser', data)

		if (data) ipc.iap.verify.mutate(data)
	}

	async afterOnlocal() {
		if (!this.data.tid) return

		const res_test = await this.test(true)

		if (res_test !== true) return

		const [err, res] = await to(trpc.iap.getStatus.mutate({ tid: this.data.tid }))

		if (err) return
		if (res.error !== null) return $message.error(res.error)

		$app.Event.emit('global.auth.saveUser', res.data)

		ipc.iap.verify.mutate(res.data)
	}

	async afterSign() {
		if (!this.data.tid) return

		await this.afterPurchase(this.data)
	}

	async test(ignore_message?: boolean) {
		let close: MessageType | null = null

		if (!ignore_message) close = $message.loading($t('app.auth.test_title'), 30)

		const [err_raw] = await to(hono.test.$get())

		if (close) close()

		if (err_raw) return $message.error($t('app.auth.test_failed'), 24)

		return true
	}

	on() {
		$app.Event.on('global.iap.afterOnlocal', this.afterOnlocal)
		$app.Event.on('global.iap.afterSign', this.afterSign)
	}

	off() {
		if (!is_mas_id) return

		this.utils.off()

		$app.Event.off('global.iap.afterOnlocal', this.afterOnlocal)
		$app.Event.off('global.iap.afterSign', this.afterSign)
	}
}
