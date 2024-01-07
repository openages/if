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
		const locale = (await import(`dayjs/locale/${lang}`)).default

		dayjs.locale(lang, locale)

		if (lang === 'en') {
			dayjs.updateLocale('en', {
				relativeTime: {
					future: 'after %s',
					past: '%s ago',
					s: 'a few seconds',
					m: 'a minute',
					mm: '%d minutes',
					h: 'an hour',
					hh: '%d hours',
					d: 'a day',
					dd: '%d days',
					M: 'a month',
					MM: '%d months',
					y: 'a year',
					yy: '%d years'
				}
			})
		}
	}

	async setLang(lang: Lang) {
		this.lang = lang

		await this.getLocale(lang)

		window.location.reload()
	}

	off() {
		this.utils.off()
	}
}
