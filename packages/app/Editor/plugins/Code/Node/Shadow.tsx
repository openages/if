import type { IPropsShadow } from '../types'

const Index = (props: IPropsShadow) => {
	const { html } = props

	return <span className='w_100' dangerouslySetInnerHTML={{ __html: html }}></span>
}

export default $app.memo(Index)
