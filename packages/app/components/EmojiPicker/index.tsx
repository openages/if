import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useMemo, useEffect } from 'react'

import { useGlobal } from '@/context/app'
import data from '@emoji-mart/data'
import en from '@emoji-mart/data/i18n/en.json'
import zh from '@emoji-mart/data/i18n/zh.json'
import Picker from '@emoji-mart/react'

import category_icons from './category_icons'
import { feather_icons, ionicons, phosphor_icons } from './customs'

interface IProps {
	onEmojiSelect: ({ shortcodes }: { shortcodes: string }) => void
}

const Index = (props: IProps) => {
	const { onEmojiSelect } = props
	const global = useGlobal()

	const i18n = useMemo(() => {
		const map = {
			en,
			zh
		}

		return map[global.locale.lang]
	}, [global.locale.lang])

	const makeImgColor = useMemoizedFn(() => {
		if (global.setting.theme === 'light') return

		const picker = document.querySelector('em-emoji-picker')
		const root = picker.shadowRoot
		const imgs = root.querySelectorAll('.emoji-mart-emoji img')

		imgs.forEach((item: HTMLImageElement) => {
			item.style.filter = 'invert(80%)'
		})
	})

	const delaymakeImgColor = useMemoizedFn(() => setTimeout(makeImgColor, 30))

	useEffect(() => {
		if (global.setting.theme === 'light') return

		const picker = document.querySelector('em-emoji-picker')
		const root = picker.shadowRoot

		let scroll_container = null as HTMLDivElement | null
		let nav_buttons: NodeListOf<HTMLButtonElement>

		const timer = setTimeout(() => {
			makeImgColor()

			scroll_container = root.querySelector('.scroll') as HTMLDivElement
			nav_buttons = root.querySelectorAll('#nav button') as NodeListOf<HTMLButtonElement>

			nav_buttons.forEach((item) => {
				item.addEventListener('click', delaymakeImgColor)
			})

			scroll_container?.addEventListener('scroll', makeImgColor)
		}, 30)

		return () => {
			clearInterval(timer)

			scroll_container?.removeEventListener('scroll', makeImgColor)

			nav_buttons?.forEach((item) => {
				item.removeEventListener('click', delaymakeImgColor)
			})
		}
	}, [global.setting.theme])

	return (
		<Picker
			data={data}
			i18n={i18n}
			theme={global.setting.theme}
			categoryIcons={category_icons}
			custom={[
				{
					id: 'feather_icons',
					name: 'Feather Icons',
					emojis: feather_icons.icon_array
				},
				{
					id: 'ionicons',
					name: 'Ionicons',
					emojis: ionicons.icon_array
				},
				{
					id: 'phosphor_icons',
					name: 'Phosphor Icons',
					emojis: phosphor_icons.icon_array
				}
			]}
			previewPosition='none'
			noCountryFlags={true}
			emojiButtonSize={42}
			emojiSize={24}
			emojiButtonRadius='6px'
			dynamicWidth
			onEmojiSelect={(target: { shortcodes: string }) => {
				onEmojiSelect(target)
				delaymakeImgColor()
			}}
		/>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
