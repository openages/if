import { MessageType } from 'antd/es/message/interface'
import to from 'await-to-js'
import { makeAutoObservable } from 'mobx'
import { local } from 'stk/dist/storage'
import { injectable } from 'tsyringe'

import { paddle } from '@/appdata/pay'
import Utils from '@/models/utils'
import { getUserData, hono, is_mas_id } from '@/utils'
import { initializePaddle } from '@paddle/paddle-js'

import type { Iap } from '@/types'

import type { Paddle } from '@paddle/paddle-js'

@injectable()
export default class Index {
	data = {} as { tid: string; receipt_url: string }
	type = 'pro' as 'pro' | 'infinity'
	paddle = null as unknown as Paddle
	prices = {} as Record<Iap.Plan, string>
	loading = false

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
		this.loading = true

		const user = getUserData()

		if (!user?.id) {
			$app.Event.emit('global.setting.goLogin')

			this.loading = false

			return $message.info($t('app.not_login'))
		}

		this.paddle.Spinner.show()

		this.paddle.Checkout.open({
			settings: { theme: local.theme },
			items: [{ priceId: paddle.sandbox.price_id[this.type], quantity: 1 }],
			customData: { type: this.type, user_id: user.id }
		})

		setTimeout(() => {
			this.loading = false
		}, 1500)
	}

	async cancelSubscription() {
		this.paddle.Retain.initCancellationFlow({
			subscriptionId: ''
		})
	}

	async test(ignore_message?: boolean) {
		let close: MessageType | null = null

		if (!ignore_message) close = $message.loading($t('app.auth.test_title'), 30)

		const [err_raw] = await to(hono.test.$get())

		if (close) close()

		if (err_raw) return $message.error($t('app.auth.test_failed'), 24)

		return true
	}

	on() {}

	off() {
		if (!is_mas_id) return

		this.utils.off()
	}
}
