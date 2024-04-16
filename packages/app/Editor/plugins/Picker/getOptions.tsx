import { Image, Smiley } from '@phosphor-icons/react'

import Option from './option'

import type Model from './model'

export default (query_string: string, showModal: (v: Model['modal']) => void) => {
	const regex = new RegExp(query_string, 'i')

	return [
		new Option('Image', {
			icon: <Image />,
			shortcut: 'img',
			onSelect: () => showModal('Image')
		}),
		new Option('Emoji', {
			icon: <Smiley />,
			shortcut: 'emo',
			onSelect: () => showModal('Emoji')
		})
	].filter(option => regex.test(option.title.toLowerCase()) || regex.test(option.shortcut))
}
