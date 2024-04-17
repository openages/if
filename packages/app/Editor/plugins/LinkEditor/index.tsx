import { Popover } from 'antd'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import Model from './model'

import type { IProps } from './types'

const Index = (props: IProps) => {
	const {} = props
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()

	useLayoutEffect(() => {
		x.init(editor)

		return () => x.off()
	}, [editor])

	const content = <div>123</div>

	return (
		<Popover
			open={x.visible}
			content={content}
			destroyTooltipOnHide
			getPopupContainer={() => document.body}
		></Popover>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
