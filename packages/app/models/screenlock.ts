import to from 'await-to-js'
import { enc, AES } from 'crypto-js'
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
import { injectable } from 'tsyringe'

import { autolock_value, passphrase } from '@/appdata'
import Utils from '@/models/utils'
import { getDocItem, sleep } from '@/utils'
import { Idle } from '@openages/stk/common'
import { setStorageWhenChange } from '@openages/stk/mobx'

import type { App } from '@/types'

@injectable()
export default class Index {
	modal_open = false
	screenlock_open = false
	password_mode = true
	input_password = ''
	input_private_key = ''
	loading = false
	verified = true
	keypair = { private_key: '', public_key: '', password: '' } as Omit<App.Screenlock, 'autolock'>
	data = { private_key: '', public_key: '', password: '', autolock: '30m' } as App.Screenlock
	click_times = 0
	clicked = false

	constructor(
		public utils: Utils,
		public idle: Idle
	) {
		makeAutoObservable(this, { utils: false, idle: false }, { autoBind: true })

		this.utils.acts = [setStorageWhenChange([{ screenlock_data: 'data' }], this)]
		this.screenlock_open = this.data.password ? true : false
	}

	async init(unlock?: boolean) {
		if (unlock) return this.on()

		await this.getScreenlock()

		this.screenlock_open = this.data.password ? true : false

		this.on()
	}

	async getScreenlock() {
		const key = await $db.kv.findOne('screenlock').exec()

		if (!key) return

		this.data = JSON.parse(getDocItem(key).value)
	}

	async genKeyPair(password: string, by_unlocking?: boolean) {
		const { privateKey, publicKey: public_key } = await generateKey({
			type: 'ecc',
			curve: 'ed25519Legacy',
			format: 'armored',
			passphrase,
			userIDs: { name: '1yasa', email: 'openages@gmail.com', comment: password }
		})

		let private_key = AES.encrypt(privateKey, password).toString()

		if (by_unlocking) {
			private_key = AES.encrypt(AES.encrypt(privateKey, passphrase).toString(), passphrase).toString()
		}

		const target = {
			private_key,
			public_key,
			password: AES.encrypt(password, private_key).toString()
		}

		if (by_unlocking) return target

		this.keypair = target
	}

	async verify(value: string, use_password: boolean, by_sceenlock?: boolean) {
		let private_key = ''

		if (use_password) {
			private_key = ntry(() => AES.decrypt(this.data.private_key, value).toString(enc.Utf8))
		} else {
			const password = ntry(() => AES.decrypt(this.data.password, value).toString(enc.Utf8))

			private_key = ntry(() => AES.decrypt(this.data.private_key, password).toString(enc.Utf8))
		}

		if (!by_sceenlock) await sleep(600)
		if (!private_key) return false

		return this.verifyByPrivateKey(private_key, by_sceenlock)
	}

	async verifyByPrivateKey(private_key: string, by_sceenlock?: boolean) {
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

		if (by_sceenlock) {
			this.screenlock_open = false

			$app.Event.emit('global.app.unlock')

			$navigate('/')
		}

		return true
	}

	async saveKeyPair(keypair?: Omit<App.Screenlock, 'autolock'>) {
		if (keypair) this.data = { ...keypair, autolock: this.data.autolock }

		const data = { key: 'screenlock', value: JSON.stringify($copy(this.data)) }
		const screenlock = (await $db.kv.findOne('screenlock').exec()) ?? (await $db.kv.insert(data))

		await screenlock.incrementalPatch({ value: data.value })
	}

	async resetPassword() {
		this.data = { private_key: '', public_key: '', password: '', autolock: this.data.autolock }

		await this.saveKeyPair()
	}

	async setAutoLock(v: App.Screenlock['autolock']) {
		this.data.autolock = v
		this.idle.time = autolock_value[v]

		await this.saveKeyPair()
	}

	async getFingerprint() {
		const { code, err } = await (await import('@openages/stk/creep')).getFingerprint()

		if (!code && err) {
			$message.error($t('translation:setting.Screenlock.getFingerprint.error'))

			return ''
		}

		return code
	}

	async unlocking() {
		const code = await this.getFingerprint()

		const { private_key, public_key, password } = await this.genKeyPair(code, true)

		this.data = { private_key, public_key, password, autolock: this.data.autolock, unlocking: true }

		await this.saveKeyPair()
	}

	async unlock(value: string) {
		const private_key = ntry(() => AES.decrypt(value, passphrase).toString(enc.Utf8))

		if (!private_key) return (this.verified = false)

		const ok = await this.verifyByPrivateKey(private_key, true)

		this.verified = ok

		if (!ok) return

		await this.resetPassword()
	}

	async lock() {
		if (!this.data.password) return

		const has_timer = await $app.Event.emit('global.app.hasTimer')

		if (has_timer) return

		this.screenlock_open = true

		$app.Event.emit('global.app.lock')

		this.idle.off()
	}

	on() {
		if (!this.data.unlocking && this.data.password) {
			this.idle.init(this.screenlock_open ? 0 : autolock_value[this.data.autolock], {
				context: this,
				onIdle: this.lock
			})
		}

		$app.Event.on('global.screenlock.lock', this.lock)
	}

	off() {
		this.idle.off()

		$app.Event.off('global.screenlock.lock', this.lock)
	}
}
