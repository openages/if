import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState, Suspense } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'

import { IPropsImage } from '../types'
import Element from './Element'
import Model from './model'

const Index = (props: IPropsImage) => {
	const { src, altText, nodeKey, width, height, maxWidth, showCaption } = props
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()
	const [selected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey)

	useLayoutEffect(() => {
		x.init(editor, setSelected, clearSelection)

		return () => x.off()
	}, [editor, setSelected, clearSelection])

	useEffect(() => {
		x.selected = selected
	}, [selected])

	const setRef = useMemoizedFn(v => (x.ref = v))

	return (
		<Suspense fallback={null}>
			<div className='flex flex_column'>
				<div draggable={x.draggable}>
					<Element
						src={src}
						altText={altText}
						width={width}
						height={height}
						maxWidth={maxWidth}
						setRef={setRef}
					/>
				</div>
				{showCaption && <div className='image-caption-container'></div>}
			</div>
		</Suspense>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
