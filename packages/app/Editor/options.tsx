import { $getSelection, $isRangeSelection } from 'lexical'

import { INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list'
import { $setBlocksType } from '@lexical/selection'
import {
	CaretDown,
	CodeSimple,
	CubeFocus,
	Divide,
	Function,
	GpsFix,
	Image,
	ListBullets,
	ListChecks,
	ListNumbers,
	Quotes,
	Smiley,
	Table,
	TreeStructure
} from '@phosphor-icons/react'

import {
	INSERT_CODE_COMMAND,
	INSERT_DIVIDER_COMMAND,
	INSERT_NAVIGATION_COMMAND,
	INSERT_TABLE_COMMAND,
	INSERT_TOGGLE_COMMAND
} from './commands'
import Option from './plugins/Picker/option'
import { $createQuoteNode } from './plugins/Quote/utils'

import type Model from './plugins/Picker/model'
import type { LexicalEditor } from 'lexical'

interface Args {
	query_string: string
	editor: LexicalEditor
	text_mode?: boolean
	linebreak?: boolean
	showModal: (v: Model['modal']) => void
}

export default (args: Args) => {
	const { query_string, editor, text_mode, linebreak, showModal } = args
	const regex = new RegExp(query_string, 'i')

	if (text_mode) {
		const options = [
			new Option($t('editor.name.Emoji'), {
				icon: <Smiley />,
				shortcut: 'emo',
				onSelect: () => showModal('Emoji')
			}),
			new Option($t('editor.name.Ref'), {
				icon: <CubeFocus />,
				shortcut: 'ref',
				onSelect: () => showModal('Ref')
			})
		]

		if (linebreak) {
			options.push(
				new Option($t('editor.name.UnorderedList'), {
					icon: <ListBullets />,
					shortcut: 'ul',
					onSelect: () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, null!)
				}),
				new Option($t('editor.name.OrderedList'), {
					icon: <ListNumbers />,
					shortcut: 'ol',
					onSelect: () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, null!)
				}),
				new Option($t('editor.name.TodoList'), {
					icon: <ListChecks />,
					shortcut: 'tl',
					onSelect: () => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, null!)
				})
			)
		}

		return options
	}

	return [
		new Option($t('editor.name.Image'), {
			icon: <Image />,
			shortcut: 'img',
			onSelect: () => showModal('Image')
		}),
		new Option($t('editor.name.Emoji'), {
			icon: <Smiley />,
			shortcut: 'emo',
			onSelect: () => showModal('Emoji')
		}),
		new Option($t('editor.name.Code'), {
			icon: <CodeSimple />,
			shortcut: 'cd',
			onSelect: () => editor.dispatchCommand(INSERT_CODE_COMMAND, null)
		}),
		new Option($t('editor.name.UnorderedList'), {
			icon: <ListBullets />,
			shortcut: 'ul',
			onSelect: () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, null!)
		}),
		new Option($t('editor.name.OrderedList'), {
			icon: <ListNumbers />,
			shortcut: 'ol',
			onSelect: () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, null!)
		}),
		new Option($t('editor.name.TodoList'), {
			icon: <ListChecks />,
			shortcut: 'tl',
			onSelect: () => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, null!)
		}),
		new Option($t('editor.name.Table'), {
			icon: <Table />,
			shortcut: 'tb',
			onSelect: () => editor.dispatchCommand(INSERT_TABLE_COMMAND, null)
		}),
		new Option($t('editor.name.Divider'), {
			icon: <Divide />,
			shortcut: 'dv',
			onSelect: () => editor.dispatchCommand(INSERT_DIVIDER_COMMAND, null)
		}),
		new Option($t('editor.name.Quote'), {
			icon: <Quotes />,
			shortcut: 'qt',
			onSelect: () => {
				editor.update(() => {
					const selection = $getSelection()

					if (!$isRangeSelection(selection)) return

					$setBlocksType(selection, () => $createQuoteNode())
				})
			}
		}),
		new Option($t('editor.name.Toggle'), {
			icon: <CaretDown />,
			shortcut: 'tg',
			onSelect: () => editor.dispatchCommand(INSERT_TOGGLE_COMMAND, null)
		}),
		new Option($t('editor.name.Katex'), {
			icon: <Function />,
			shortcut: 'ktx',
			onSelect: () => showModal('Katex')
		}),
		new Option($t('editor.name.Mermaid'), {
			icon: <TreeStructure />,
			shortcut: 'mmd',
			onSelect: () => showModal('Mermaid')
		}),
		new Option($t('editor.name.Navigation'), {
			icon: <GpsFix />,
			shortcut: 'cat',
			onSelect: () => editor.dispatchCommand(INSERT_NAVIGATION_COMMAND, null)
		}),
		new Option($t('editor.name.Ref'), {
			icon: <CubeFocus />,
			shortcut: 'ref',
			onSelect: () => showModal('Ref')
		})
	].filter(option => regex.test(option.title.toLowerCase()) || regex.test(option.shortcut))
}
