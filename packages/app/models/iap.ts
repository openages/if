import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import Utils from '@/models/utils'
import { getUserData, ipc, trpc } from '@/utils'
import { loading } from '@/utils/decorators'

import type { Product } from 'electron'
import type { Iap } from '@/types'

@injectable()
export default class Index {
	products = {} as Record<Iap.Plan, Product>

	constructor(
		public utils: Utils,
		public global: GlobalModel
	) {
		makeAutoObservable(this, { utils: false, global: false }, { autoBind: true })
	}

	async init() {
		this.getProducts()
		this.onPurchaseUpdated()
		this.verify()
	}

	onPurchaseUpdated() {
		ipc.ipa.onUpdated.subscribe(undefined, {
			onData: async v => {
				switch (v.state) {
					case 'purchased':
						$message.warning($t('iap.state.purchased'))

						await this.afterPurchase(v.data!)
						break
					case 'failed':
						$message.warning($t('iap.state.failed'))
						break
				}

				$app.Event.emit('app/setLoading', { visible: false })
			}
		})
	}

	async verify() {
		const user = getUserData()

		if (!user) return

		const res = await trpc.iap.verifyReceipt.mutate({ id: user.id })

		if (res.error !== null || !res.data) return

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
		const res = await ipc.ipa.purchase.mutate({ id })

		if (res.error !== null || !res.ok) return $message.error(res.error)

		$app.Event.emit('app/setLoading', { visible: true, desc: $t('iap.state.purchasing') })
	}

	async afterPurchase(args: { tid: string; receipt_url: string }) {
		const { tid, receipt_url } = args

		const { id, refresh_token } = getUserData()!

		const res_update = await trpc.iap.updateReceipt.mutate({ id, refresh_token, tid, receipt_url })

		if (res_update.error !== null) return $message.error($t('iap.error'))

		const res_verify = await trpc.iap.verifyReceipt.mutate({ id, after_update: true })

		if (res_verify.error !== null) return $message.error($t('iap.error'))

		const data = res_verify.data!

		$app.Event.emit('global.auth.saveUser', data)

		ipc.ipa.verify.mutate(data)
	}

	off() {
		this.utils.off()
	}
}
