import to from 'await-to-js'
import { enc, AES } from 'crypto-js'
import stringify from 'json-stable-stringify'
import { makeAutoObservable } from 'mobx'
import ntry from 'nice-try'
import * as openpgp from 'openpgp'
import {
	createCleartextMessage,
	createMessage,
	decrypt,
	decryptKey,
	encrypt,
	encryptKey,
	generateKey,
	readCleartextMessage,
	readKey,
	readMessage,
	readPrivateKey,
	sign
} from 'openpgp/lightweight'
import { injectable } from 'tsyringe'

import { modules } from '@/appdata'
import Utils from '@/models/utils'
import { getDocItem, sleep } from '@/utils'
import { setStorageWhenChange, useInstanceWatch } from '@openages/stk/mobx'

import type { App, DirTree } from '@/types'
import type { Watch } from '@openages/stk/mobx'

const passphrase = window.__key__() + '123654zxy' + window.__key__()

@injectable()
export default class Index {
	app_modules = modules as App.Modules
	actives = [] as Array<{ app: App.ModuleType; pathname: string; key: string }>
	visible_app_menu = false
	visible_app_switch = false
	switch_index = 0

	search = {
		open: false,
		module: '' as App.ModuleType,
		items: [] as Array<{ item: any; file: DirTree.Item; setting: any }>,
		index: 0
	}
	search_history = [] as Array<string>

	screenlock = {
		private_key: '',
		public_key: '',
		password: '',
		autolock: '30m'
	} as App.Screenlock

	get visibles() {
		return [this.visible_app_menu, this.visible_app_switch]
	}

	watch = {
		'visible_app_menu|visible_app_switch': () => {
			if (this.visible_app_menu) this.visible_app_switch = false
			if (this.visible_app_switch) this.visible_app_menu = false
		}
	} as Watch<Index & { 'visible_app_menu|visible_app_switch': any }>

	constructor(public utils: Utils) {
		makeAutoObservable(this, { watch: false }, { autoBind: true })

		this.utils.acts = [setStorageWhenChange(['app_modules', 'screenlock', 'search_history'], this)]
	}

	get apps() {
		return $copy(this.app_modules).filter(item => {
			if (item.fixed) return true
			if (this.actives.find(i => i.app === item.title)) return true

			return false
		})
	}

	init() {
		this.utils.acts = [...useInstanceWatch(this)]

		this.getPublicKey()
		this.on()
	}

	async getPublicKey() {
		const key = await $db.kv.findOne('screenlock').exec()

		if (!key) return

		this.screenlock = JSON.parse(getDocItem(key).value)
	}

	async searchByInput(text: string) {
		if (!text) return (this.search.items = [])

		if (this.search.module === 'todo') {
			const docs = await $db.todo_items
				.find({
					selector: {
						text: { $regex: `.*${text}.*`, $options: 'i' },
						type: 'todo'
					},
					index: 'file_id'
				})
				.exec()

			const file_ids = docs.map(item => item.file_id)

			const files = await $db.dirtree_items.findByIds(file_ids).exec()
			const settings = await $db.module_setting.findByIds(file_ids).exec()

			this.search.items = file_ids.map((_, index) => ({
				item: getDocItem(docs[index]),
				file: getDocItem(files.get(docs[index].file_id)),
				setting: JSON.parse(getDocItem(settings.get(docs[index].file_id)).setting)
			}))
		}

		if (this.search.items.length) {
			this.addSearchHistory(text)
		}
	}

	async genKeyPair(password: string) {
		const { privateKey, publicKey: public_key } = await generateKey({
			type: 'ecc',
			curve: 'ed25519',
			format: 'armored',
			passphrase,
			userIDs: { name: '1yasa', email: 'openages@gmail.com', comment: password }
		})

		const private_key = AES.encrypt(privateKey, password).toString()

		return {
			private_key,
			public_key,
			password: AES.encrypt(password, private_key).toString()
		}
	}

	async verify(value: string, use_password: boolean) {
		let private_key = ''

		if (use_password) {
			private_key = ntry(() => AES.decrypt(this.screenlock.private_key, value).toString(enc.Utf8))
		} else {
			const password = ntry(() => AES.decrypt(this.screenlock.password, value).toString(enc.Utf8))

			private_key = ntry(() => AES.decrypt(this.screenlock.private_key, password).toString(enc.Utf8))
		}

		await sleep(600)

		if (!private_key) return false

		return this.verifyByPrivateKey(private_key)
	}

	async verifyByPrivateKey(private_key: string) {
		const public_key = this.screenlock.public_key

		const publicKey = await openpgp.readKey({ armoredKey: public_key })
		const undecrypt_private_key = await openpgp.readPrivateKey({ armoredKey: private_key })
		const privateKey = await openpgp.decryptKey({ privateKey: undecrypt_private_key, passphrase })

		const unsigned_message = await openpgp.createCleartextMessage({ text: 'Hello, World!' })
		const cleartext_message = await openpgp.sign({ message: unsigned_message, signingKeys: privateKey })
		const message = await openpgp.readCleartextMessage({ cleartextMessage: cleartext_message })
		const res = await openpgp.verify({ message, verificationKeys: publicKey })

		const [err] = await to(res.signatures[0].verified)

		if (err) return false

		return true
	}

	async saveKeyPair(keypair: Omit<App.Screenlock, 'autolock'>) {
		this.screenlock = { ...keypair, autolock: this.screenlock.autolock }

		await $db.kv.insert({ key: 'screenlock', value: stringify($copy(this.screenlock)) })
	}

	update(v: App.Modules) {
		this.app_modules = v
	}

	setActives(v: Index['actives']) {
		this.actives = v
	}

	toggleAppMenu() {
		this.visible_app_menu = !this.visible_app_menu
	}

	appSwitch() {
		if (!this.actives.length) return

		if (!this.visible_app_switch) {
			this.visible_app_switch = true
		} else {
			this.changeSwitchIndex()
		}
	}

	handleAppSwitch() {
		if (!this.visible_app_switch) return

		this.visible_app_switch = false

		$navigate(this.actives[this.switch_index].pathname)
	}

	changeSwitchIndex(index?: number) {
		if (index !== undefined) return (this.switch_index = index)

		const next_value = this.switch_index + 1

		if (next_value > this.actives.length - 1) {
			this.switch_index = 0
		} else {
			this.switch_index = next_value
		}
	}

	showSearch() {
		if (this.search.module === 'setting' || !this.search.module) return

		this.search.open = true
	}

	closeSearch() {
		this.search = { open: false, module: this.search.module, items: [], index: 0 }
	}

	addSearchHistory(text: string) {
		if (this.search_history.includes(text)) return

		this.search_history.unshift(text)

		if (this.search_history.length > 15) {
			this.search_history.pop()
		}

		this.search_history = $copy(this.search_history)
	}

	on() {
		$app.Event.on('global.app.toggleAppMenu', this.toggleAppMenu)
		$app.Event.on('global.app.appSwitch', this.appSwitch)
		$app.Event.on('global.app.handleAppSwitch', this.handleAppSwitch)
		$app.Event.on('global.app.showSearch', this.showSearch)
		$app.Event.on('global.app.closeSearch', this.closeSearch)

		window.addEventListener('blur', this.handleAppSwitch)
	}

	off() {
		this.utils.off()

		$app.Event.off('global.app.toggleAppMenu', this.toggleAppMenu)
		$app.Event.off('global.app.appSwitch', this.appSwitch)
		$app.Event.off('global.app.handleAppSwitch', this.handleAppSwitch)
		$app.Event.off('global.app.showSearch', this.showSearch)
		$app.Event.off('global.app.closeSearch', this.closeSearch)

		window.removeEventListener('blur', this.handleAppSwitch)
	}
}
