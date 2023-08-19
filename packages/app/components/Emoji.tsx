interface IProps {
	shortcodes: string
	className?: string
	size?: number
	hue?: number
}

const Index = (props: IProps) => {
	const { shortcodes, className, size, hue } = props

	return (
		<em-emoji
			className={$cx(className, hue && 'has_hue')}
			shortcodes={shortcodes}
			size={`${size}px`}
			style={hue ? { filter: `hue-rotate(${hue}deg)` } : {}}
		></em-emoji>
	)
}

export default $app.memo(Index)
