import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { useStackSelector } from '@/context/stack'
import { CHANGE_EDITOR_SETTINGS } from '@/Editor/commands'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import Model from './model'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const settings = $copy(x.settings.settings)
	const id = useStackSelector(v => v.id)

	useLayoutEffect(() => {
		x.init(id, editor)
		x.settings.init()

		return () => x.settings.off()
	}, [id, editor])

	useEffect(() => {
		editor.update(() => x.setShowHeadingLevel(settings.show_heading_level))
	}, [settings.show_heading_level])

	useEffect(() => {
		editor.update(() => x.setSerif(settings.serif))
	}, [settings.serif])

	useEffect(() => {
		editor.update(() => x.setSmallText(settings.small_text))
	}, [settings.small_text])

	useEffect(() => {
		editor.dispatchCommand(CHANGE_EDITOR_SETTINGS, { key: 'toc', value: settings.toc })
	}, [settings.toc])

	useEffect(() => {
		editor.dispatchCommand(CHANGE_EDITOR_SETTINGS, { key: 'count', value: settings.count })
	}, [settings.count])

	return null
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
