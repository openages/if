import to from 'await-to-js'
import { enc, AES } from 'crypto-js'
import stringify from 'json-stable-stringify'
import { makeAutoObservable } from 'mobx'
import ntry from 'nice-try'
import {
	createCleartextMessage,
	decryptKey,
	generateKey,
	readCleartextMessage,
	readKey,
	readPrivateKey,
	sign,
	verify
} from 'openpgp/lightweight'

import { passphrase } from '@/appdata'
import { getDocItem, sleep } from '@/utils'

import type { App } from '@/types'

export default class Index {
	modal_open = false
	password_mode = true
	input_password = ''
	input_private_key = ''
	loading = false
	verified = true
	keypair = { private_key: '', public_key: '', password: '' } as Omit<App.Screenlock, 'autolock'>
	data = { private_key: '', public_key: '', password: '', autolock: '30m' } as App.Screenlock

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init() {
		this.getPublicKey()
	}

	async getPublicKey() {
		const key = await $db.kv.findOne('screenlock').exec()

		if (!key) return

		this.data = JSON.parse(getDocItem(key).value)
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

		this.keypair = {
			private_key,
			public_key,
			password: AES.encrypt(password, private_key).toString()
		}
	}

	async verify(value: string, use_password: boolean) {
		let private_key = ''

		if (use_password) {
			private_key = ntry(() => AES.decrypt(this.data.private_key, value).toString(enc.Utf8))
		} else {
			const password = ntry(() => AES.decrypt(this.data.password, value).toString(enc.Utf8))

			private_key = ntry(() => AES.decrypt(this.data.private_key, password).toString(enc.Utf8))
		}

		await sleep(600)

		if (!private_key) return false

		return this.verifyByPrivateKey(private_key)
	}

	async verifyByPrivateKey(private_key: string) {
		const public_key = this.data.public_key

		const publicKey = await readKey({ armoredKey: public_key })
		const undecrypt_private_key = await readPrivateKey({ armoredKey: private_key })
		const privateKey = await decryptKey({ privateKey: undecrypt_private_key, passphrase })

		const unsigned_message = await createCleartextMessage({ text: 'Hello, World!' })
		const cleartext_message = await sign({ message: unsigned_message, signingKeys: privateKey })
		const message = await readCleartextMessage({ cleartextMessage: cleartext_message })
		const res = await verify({ message, verificationKeys: publicKey })

		const [err] = await to(res.signatures[0].verified)

		if (err) return false

		return true
	}

	async saveKeyPair(keypair?: Omit<App.Screenlock, 'autolock'>) {
		if (keypair) this.data = { ...keypair, autolock: this.data.autolock }

		const data = { key: 'screenlock', value: stringify($copy(this.data)) }
		const screenlock = (await $db.kv.findOne('screenlock').exec()) ?? (await $db.kv.insert(data))

		await screenlock.updateCRDT({ ifMatch: { $set: { value: data.value } } })
	}

	async resetPassword() {
		this.data = { private_key: '', public_key: '', password: '', autolock: this.data.autolock }

		await this.saveKeyPair()
	}

	async setAutoLock(v: App.Screenlock['autolock']) {
		this.data.autolock = v

		await this.saveKeyPair()
	}
}
