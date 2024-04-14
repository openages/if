import { useSuspenseImage } from '../utils'

import type { IPropsLazyImage } from '../types'

export default (props: IPropsLazyImage) => {
	const { src, altText, width, height, maxWidth, className, setRef } = props

	useSuspenseImage(src)

	return (
		<img
			className={className}
			src={src}
			alt={altText}
			style={{ width, height, maxWidth }}
			draggable='false'
			ref={v => setRef(v)}
		/>
	)
}
