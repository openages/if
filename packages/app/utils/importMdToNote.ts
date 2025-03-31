import { $getRoot, createEditor } from 'lexical'

import { module_default_icon } from '@/appdata'
import { note_nodes } from '@/Editor/nodes'
import transformers from '@/Editor/transformers'
import { $convertFromMarkdownString, $exportNodeToJson } from '@/Editor/utils'
import { convertFile, id, sleep } from '@/utils'

import type { SerializedLexicalNode } from 'lexical'
import type { Note } from '@/types'

export default async (files: Array<File>) => {
	const editor = createEditor({ nodes: note_nodes })

	editor._headless = true

	let error_count = 0

	const events = files.map(async file => {
		const text = await convertFile(file)

		let nodes: Array<SerializedLexicalNode>

		editor.update(
			() => {
				try {
					const root = $getRoot()

					$convertFromMarkdownString(text, transformers, root, false)

					nodes = $exportNodeToJson(root).children
				} catch (error) {
					error_count++
				}
			},
			{ discrete: true }
		)

		const file_id = id()

		await $app.Event.emit('global.app.toggleHomeDrawer', { tab: 'apps', active: 'note' })

		await sleep(360)

		await $app.Event.emit('note/dirtree/insert', {
			type: 'file',
			id: file_id,
			name: file.name.split('.').at(0),
			icon: module_default_icon.note
		})

		const items = nodes!.map((item, index) => {
			let prev = undefined
			let next = undefined

			if (index !== 0) {
				const prev_node = nodes.at(index - 1)

				prev = prev_node?.key || prev_node?.node_key
			}

			if (index !== nodes.length - 1) {
				const next_node = nodes.at(index + 1)

				next = next_node?.key || next_node?.node_key
			}

			return {
				file_id,
				id: item.key || item.node_key,
				prev,
				next,
				content: JSON.stringify(item),
				create_at: new Date().valueOf()
			} as Note.Item
		})

		await $db.note_items.bulkInsert(items)
	})

	await Promise.all(events)

	if (error_count) {
		$message.warning(
			`${files.length - error_count} ${$t('common.import')}${$t('common.letter_space')}${$t('common.success')},${error_count} ${$t('common.import')}${$t('common.letter_space')}${$t('common.failed')}`
		)
	} else {
		$message.success(
			`${$t('common.batch')}${$t('common.letter_space')}${$t('common.import')}${$t('common.letter_space')}${$t('common.success')}`
		)
	}
}
