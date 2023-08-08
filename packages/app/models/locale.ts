import i18next from 'i18next'
import { makeAutoObservable } from 'mobx'
import { initReactI18next } from 'react-i18next'
import { injectable } from 'tsyringe'

import { en, zh } from '@/locales'
import { getLang, setStorageWhenChange } from '@/utils'
import { local } from '@openages/craftkit'

import type { Lang } from '@/appdata'

@injectable()
export default class Index {
	lang = 'en' as Lang

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
		setStorageWhenChange(['lang'], this)

		this.init()
	}

	init() {
		this.lang = local.lang ?? getLang(navigator.language)

		i18next.use(initReactI18next).init({
			debug: window.$is_dev,
			lng: this.lang,
			fallbackLng: 'en',
			resources: {
				en,
				zh
			}
		})
	}

	setLang(lang: Lang) {
		this.lang = lang

		local.lang = lang
	}
}
