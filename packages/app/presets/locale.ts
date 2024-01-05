import dayjs from 'dayjs'
import i18next from 'i18next'
import backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

import { getLang } from '@/utils'
import { local } from '@openages/stk/storage'

import type { Lang } from '@/appdata'

const ns = 'translation'

export const init = async () => {
	const lang = local.lang ?? getLang(navigator.language)

	// const locale = await getLocale(lang)

	await i18next
		.use(backend)
		.use(initReactI18next)
		.init({
			lng: lang,
			debug: true,
			fallbackLng: 'en',
			load: 'languageOnly',
			returnObjects: true,
			interpolation: { escapeValue: false },
			react: { useSuspense: false },
			backend: { loadPath: '/locales/{{lng}}.json' }
		})

	// setLang(lang)
}

export const getLocale = async (lang: Lang) => {
	await import(`dayjs/locale/${lang}`)

	dayjs.locale(lang)

	return (await import(`../locales/${lang}/index`)).default
}

export const setLang = async (lang: Lang) => {
	// const locale = await getLocale(lang)

	// i18next.addResourceBundle(lang, ns, locale, true, true)

	await i18next.changeLanguage(lang)

	local.lang = lang

	// i18next.languages.forEach(language => {
	// 	if (language === lang) return

	// 	i18next.removeResourceBundle(language, ns)
	// })
}
