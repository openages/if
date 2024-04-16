import { useMemoizedFn } from 'ahooks'
import { $createTextNode, $getSelection, $isRangeSelection } from 'lexical'

import { EmojiPicker } from '@/components'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import type { IPropsModal } from '../../types'

const Index = (props: IPropsModal) => {
	const { onClose } = props
	const [editor] = useLexicalComposerContext()

	const onEmojiSelect = useMemoizedFn(({ native, shortcodes }) => {
		const target = native || shortcodes

		editor.update(() => {
			const selection = $getSelection()

			if (!$isRangeSelection(selection)) return

			selection.insertNodes([$createTextNode(target)])

			onClose()
		})
	})

	return <EmojiPicker disableCustom onEmojiSelect={onEmojiSelect}></EmojiPicker>
}

export default $app.memo(Index)
