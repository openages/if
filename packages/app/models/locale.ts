import i18next from 'i18next'
import { makeAutoObservable } from 'mobx'
import { initReactI18next } from 'react-i18next'
import { injectable } from 'tsyringe'

import { en, zh } from '@/locales'
import Utils from '@/models/utils'
import { getLang } from '@/utils'
import { local, setStorageWhenChange } from '@openages/craftkit'

import type { Lang } from '@/appdata'

@injectable()
export default class Index {
	lang = 'en' as Lang

	constructor(public utils: Utils) {
            makeAutoObservable(this, {}, { autoBind: true })
            
		this.utils.acts =[setStorageWhenChange(['lang'], this)]

		this.init()
	}

	init() {
		this.lang = local.lang ?? getLang(navigator.language)

		i18next.use(initReactI18next).init({
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
      
      off() {
		this.utils.off()
	}
}
