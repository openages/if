import to from 'await-to-js'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import Utils from '@/models/utils'
import { getUserData, hono, ipc, trpc } from '@/utils'
import { loading } from '@/utils/decorators'

import type { Product } from 'electron'
import type { Iap } from '@/types'

@injectable()
export default class Index {
	paying = false
	products = {} as Record<Iap.Plan, Product>
	current = null as 'pro' | 'sponsor' | null

	constructor(public utils: Utils) {
		makeAutoObservable(this, { utils: false }, { autoBind: true })
	}

	async init() {
		this.getProducts()
		this.onPurchaseUpdated()
		this.verify()
	}

	onPurchaseUpdated() {
		ipc.ipa.onUpdated.subscribe(undefined, {
			onData: async v => {
				if (!this.paying) return

				this.paying = false

				if (v.state !== 'purchasing') {
					this.current = null

					$app.Event.emit('app/setLoading', { visible: false })
				}

				switch (v.state) {
					case 'purchased':
						$message.success($t('iap.state.purchased'))

						await this.afterPurchase(v.data!)

						break
					case 'failed':
						$message.warning($t('iap.state.failed'))

						break
				}
			}
		})
	}

	async verify() {
		const user = getUserData()

		if (!user) return

		const [err, res] = await to(trpc.iap.verifyReceipt.mutate({ id: user.id }))

		if (err || res.error !== null || !res.data) return

		const data = res.data!

		$app.Event.emit('global.auth.saveUser', data)

		ipc.ipa.verify.mutate(data)
	}

	async getProducts() {
		const res = await ipc.ipa.getProducts.query()

		if (res.error !== null) return $message.error(res.error)

		this.products = res.data
	}

	@loading
	async purchase(id: string) {
		const close = $message.loading($t('app.auth.test_title'), 30)

		const [err_raw] = await to(hono.test.$get())

		close()

		if (err_raw) return $message.error($t('app.auth.test_failed'), 24)

		const res = await ipc.ipa.purchase.mutate({ id })

		this.paying = true

		if (res.error !== null || !res.ok) {
			this.paying = false

			return $message.error(res.error)
		}

		$app.Event.emit('app/setLoading', { visible: true, desc: $t('iap.state.purchasing') })
	}

	async afterPurchase(args: { tid: string; receipt_url: string }) {
		const { tid, receipt_url } = args

		const { id, refresh_token } = getUserData()!

		const [err_update, res_update] = await to(
			trpc.iap.updateReceipt.mutate({ id, refresh_token, tid, receipt_url })
		)

		if (err_update || res_update.error !== null) return $message.error($t('iap.error'), 60)

		const [err_verify, res_verify] = await to(trpc.iap.verifyReceipt.mutate({ id, after_update: true }))

		if (err_verify || res_verify.error !== null) return $message.error($t('iap.error'), 60)

		const data = res_verify.data!

		$app.Event.emit('global.auth.saveUser', data)

		if (data) ipc.ipa.verify.mutate(data)
	}

	off() {
		this.utils.off()
	}
}
