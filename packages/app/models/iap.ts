import { MessageType } from 'antd/es/message/interface'
import to from 'await-to-js'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import Utils from '@/models/utils'
import { conf, getUserData, hono, ipc, is_mac_dev, is_mas_id, trpc } from '@/utils'
import { loading } from '@/utils/decorators'

import type { Product } from 'electron'
import type { Iap } from '@/types'

@injectable()
export default class Index {
	data = {} as { tid: string; receipt_url: string }
	products = {} as Record<Iap.Plan, Product>
	current = null as 'pro' | 'sponsor' | null

	constructor(public utils: Utils) {
		makeAutoObservable(this, { utils: false }, { autoBind: true })
	}

	init() {
		if (!is_mas_id && !is_mac_dev) return

		this.getProducts()
		this.onPurchaseUpdated()
		this.verify()

		this.on()
	}

	onPurchaseUpdated() {
		const { unsubscribe } = ipc.ipa.onUpdated.subscribe(undefined, {
			onData: async v => {
				if (v.type === 'empty') {
					await conf.set('oniap', false)

					$app.Event.emit('app/setLoading', { visible: false })

					return
				}

				if (v.type === 'onlocal') {
					this.data = v.data

					this.afterOnlocal()

					return
				}

				if (v.state === 'purchasing') return

				this.current = null

				await conf.set('oniap', false)

				$app.Event.emit('app/setLoading', { visible: false })

				switch (v.state) {
					case 'purchased':
						$message.success($t('iap.state.purchased'))

						await this.afterPurchase(v.data!)

						break
					case 'restored':
						if (v.data?.tid) {
							$message.success($t('iap.state.restored'))

							await this.afterPurchase(v.data!)
						}

						break
					case 'failed':
						$message.warning($t('iap.state.failed'))

						break
				}
			}
		})

		this.utils.acts.push(unsubscribe)
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

		ipc.ipa.verify.mutate(data || { paid_plan: 'free' })
	}

	async getProducts() {
		const res = await ipc.ipa.getProducts.query()

		if (res.error !== null) return $message.error(res.error)

		this.products = res.data
	}

	@loading
	async purchase(id: string) {
		const res_test = await this.test()

		if (res_test !== true) return

		await conf.set('oniap', true)

		const res = await ipc.ipa.purchase.mutate({ id })

		if (res.error !== null || !res.ok) {
			return $message.error(res.error)
		}

		$app.Event.emit('app/setLoading', { visible: true, desc: $t('iap.state.purchasing'), showClose: true })
	}

	async restore() {
		const res_test = await this.test()

		if (res_test !== true) return

		await conf.set('oniap', true)

		await ipc.ipa.restore.query()

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

		if (data) ipc.ipa.verify.mutate(data)
	}

	async afterOnlocal() {
		if (!this.data.tid) return

		const res_test = await this.test(true)

		if (res_test !== true) return

		const [err, res] = await to(trpc.iap.getStatus.mutate({ tid: this.data.tid }))

		if (err) return
		if (res.error !== null) return $message.error(res.error)

		$app.Event.emit('global.auth.saveUser', res.data)

		ipc.ipa.verify.mutate(res.data)
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
