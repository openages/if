import { Image } from '@phosphor-icons/react'

import Option from './option'

import type Model from './model'

export default (query_string: string, showModal: (v: Model['modal']) => void) => {
	const regex = new RegExp(query_string, 'i')

	return [
		new Option('Image', {
			icon: <Image />,
			keywords: ['image', 'photo', 'picture', 'file'],
			onSelect: () => showModal('image')
		})
	].filter(option => regex.test(option.title) || option.keywords.some(keyword => regex.test(keyword)))
}
