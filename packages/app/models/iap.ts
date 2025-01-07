import { MessageType } from 'antd/es/message/interface'
import to from 'await-to-js'
import { makeAutoObservable } from 'mobx'
import { local } from 'stk/dist/storage'
import { injectable } from 'tsyringe'

import { getPaddleConfig, getPaddlePriceItems } from '@/appdata/pay'
import Utils from '@/models/utils'
import { getUserData, hono, is_sandbox, paddle_client_token } from '@/utils'
import { loading } from '@/utils/decorators'
import { initializePaddle } from '@paddle/paddle-js'

import type { Iap } from '@/types'

import type { Paddle } from '@paddle/paddle-js'
import type { GlobalLoadingState } from '@/components/GlobalLoading'

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
			environment: is_sandbox ? 'sandbox' : 'production',
			token: paddle_client_token
		})

		if (!res) return

		this.paddle = res

		this.getPrices()
	}

	@loading
	async getPrices() {
		const [err, res] = await to(
			this.paddle.PricePreview({
				items: getPaddlePriceItems()
			})
		)

		if (err) {
			$app.Event.emit('global.auth.setTestStatus', 'error')

			return $message.error($t('iap.err_get_prices'))
		}

		this.prices = {
			pro: res.data.details.lineItems[0].formattedTotals.subtotal,
			infinity: res.data.details.lineItems[1].formattedTotals.subtotal
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

		$app.Event.emit('app/setLoading', {
			visible: true,
			desc: $t('app.paying'),
			close_text: $t('app.done'),
			close: () => $app.Event.emit('global.auth.getStatus')
		} as GlobalLoadingState)

		this.paddle.Spinner.show()

		this.paddle.Checkout.open({
			settings: { theme: local.theme },
			items: [{ priceId: getPaddleConfig().price_id[this.type], quantity: 1 }],
			customData: { type: this.type, user_id: user.id }
		})

		setTimeout(() => {
			this.loading = false
		}, 1500)
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
		this.utils.off()
	}
}
