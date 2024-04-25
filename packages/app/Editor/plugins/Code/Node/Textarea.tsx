import type { IPropsTextarea } from '../types'

const Index = (props: IPropsTextarea) => {
	const { source, onInput, onKeyDown } = props

	return (
		<textarea
			className='input_wrap w_100 h_100 border_box absolute z_index_10'
			autoComplete='off'
			autoCorrect='off'
			autoCapitalize='off'
			spellCheck='false'
			autoFocus
			value={source}
			onInput={onInput}
			onKeyDown={onKeyDown}
		></textarea>
	)
}

export default $app.memo(Index)
