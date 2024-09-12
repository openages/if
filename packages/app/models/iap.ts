import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import Utils from '@/models/utils'
import { ipc } from '@/utils'
import { loading } from '@/utils/decorators'

import type { Product } from 'electron'
import type { Iap } from '@/types'

@injectable()
export default class Index {
	products = {} as Record<Iap.Plan, Product>

	constructor(public utils: Utils) {
		makeAutoObservable(this, { utils: false }, { autoBind: true })
	}

	init() {
		this.getProducts()
		this.onPurchaseUpdated()
	}

	onPurchaseUpdated() {
		ipc.ipa.onUpdated.subscribe(undefined, {})
	}

	async getProducts() {
		const res = await ipc.ipa.getProducts.query()

		if (res.error !== null) return $message.error(res.error)

		this.products = res.data
	}

	async purchase(id: string) {
		console.log('purchase', id)
		const res = await ipc.ipa.purchase.mutate({ id })

		if (res.error !== null || !res.ok) return

		$app.Event.emit('app/setLoading', { visible: true, desc: $t('iap.loading.purchasing') })

		console.log(res.ok)
	}

	off() {
		this.utils.off()
	}
}
