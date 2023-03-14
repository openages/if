import type { Icon } from '@phosphor-icons/react'

interface IProps {
	Icon: Icon
	text: string
	className?: HTMLDivElement['className']
}

const Index = (props: IProps) => {
	const { Icon, text, className } = props

	return (
		<div className={$cx('option_item flex align_center', className)}>
			<Icon size={16} weight='bold'></Icon>
			<span className='text ml_6 font_bold'>{text}</span>
		</div>
	)
}

export default $app.memo(Index)
