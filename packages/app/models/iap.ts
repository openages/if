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

import type { Paddle, PricePreviewParams } from '@paddle/paddle-js'
import type { GlobalLoadingState } from '@/components/GlobalLoading'

interface PayParams {
	is_sandbox: string
	paddle_client_token: string
	price_id: string
	email: string
	type: string
	user_id: string
	theme: string
	countryCode?: string
}

@injectable()
export default class Index {
	data = {} as { tid: string; receipt_url: string }
	type = 'pro' as 'pro' | 'infinity'
	paddle = null as unknown as Paddle
	prices = {} as Record<Iap.Plan, string>
	loading = false
	pay_params = {} as PayParams
	pay_visible = false

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
		const args = { items: getPaddlePriceItems() } as PricePreviewParams

		const address = this.getAddress()

		if (address) args['address'] = address

		const [err, res] = await to(this.paddle.PricePreview(args))

		if (err) {
			$app.Event.emit('global.auth.setTestStatus', 'error')

			return $message.error($t('iap.err_get_prices'))
		}

		let pro = res.data.details.lineItems[0].formattedTotals.subtotal
		let infinity = res.data.details.lineItems[1].formattedTotals.subtotal

		if (address) {
			pro = `¥${pro.replace(' 元', '')}`
			infinity = `¥${infinity.replace(' 元', '')}`
		}

		this.prices = { pro, infinity }
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

		const address = this.getAddress()

		const pay_params = {
			is_sandbox: is_sandbox ? '1' : '0',
			paddle_client_token,
			price_id: getPaddleConfig().price_id[this.type],
			email: user.email,
			type: this.type,
			user_id: user.id,
			theme: local.theme
		} as PayParams

		if (address) pay_params['countryCode'] = address.countryCode

		this.pay_params = pay_params
		this.pay_visible = true

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

	getAddress() {
		const is_cn = local.lang === 'zh'

		if (!is_cn) return

		return { countryCode: 'CN' }
	}

	on() {}

	off() {
		this.utils.off()
	}
}
