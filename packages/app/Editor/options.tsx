import { Divide, Function, Image, Smiley } from '@phosphor-icons/react'

import { INSERT_DIVIDER_COMMAND } from './commands'
import Option from './plugins/Picker/option'

import type Model from './plugins/Picker/model'
import type { LexicalEditor } from 'lexical'

interface Args {
	query_string: string
	editor: LexicalEditor
	showModal: (v: Model['modal']) => void
}

export default (args: Args) => {
	const { query_string, editor, showModal } = args
	const regex = new RegExp(query_string, 'i')

	return [
		new Option($t('translation:editor.name.Image'), {
			icon: <Image />,
			shortcut: 'img',
			onSelect: () => showModal('Image')
		}),
		new Option($t('translation:editor.name.Emoji'), {
			icon: <Smiley />,
			shortcut: 'emo',
			onSelect: () => showModal('Emoji')
		}),
		new Option($t('translation:editor.name.Katex'), {
			icon: <Function />,
			shortcut: 'kat',
			onSelect: () => showModal('Katex')
		}),
		new Option($t('translation:editor.name.Divider'), {
			icon: <Divide />,
			shortcut: 'dv',
			onSelect: () => editor.dispatchCommand(INSERT_DIVIDER_COMMAND, null)
		})
	].filter(option => regex.test(option.title.toLowerCase()) || regex.test(option.shortcut))
}
