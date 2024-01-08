import dayjs from 'dayjs'
import i18next from 'i18next'
import { makeAutoObservable } from 'mobx'
import { initReactI18next } from 'react-i18next'
import { injectable } from 'tsyringe'

import Utils from '@/models/utils'
import { getLang } from '@/utils'
import { resourcesToBackend } from '@/utils/i18n'
import { setStorageWhenChange } from '@openages/stk/mobx'
import { local } from '@openages/stk/storage'

import type { Lang } from '@/appdata'

@injectable()
export default class Index {
	lang = 'en' as Lang

	constructor(public utils: Utils) {
		makeAutoObservable(this, {}, { autoBind: true })

		this.utils.acts = [setStorageWhenChange(['lang'], this)]

		this.init()
	}

	init() {
		this.lang = local.lang ?? getLang(navigator.language)

		this.getLocale(this.lang)

		i18next
			.use(resourcesToBackend)
			.use(initReactI18next)
			.init({
				lng: this.lang,
				fallbackLng: 'en',
				load: 'languageOnly',
				returnObjects: true,
				interpolation: { escapeValue: false }
			})
	}

	async getLocale(lang: Lang) {
		const locale = (await import(`@/locales/dayjs/${lang}`)).default

		dayjs.locale(lang, locale)
	}

	async setLang(lang: Lang) {
		if (lang === this.lang) return

		this.lang = lang

		await this.getLocale(lang)

		window.location.reload()
	}

	off() {
		this.utils.off()
	}
}
