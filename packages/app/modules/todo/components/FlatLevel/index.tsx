import { ExclamationMark } from '@phosphor-icons/react'

import styles from './index.css'

interface IProps {
	value?: number
	no_padding?: boolean
	as_label?: boolean
}

const Index = (props: IProps) => {
	const { value, no_padding, as_label } = props

	return (
		<div
			className={$cx(
				'level flex',
				styles._local,
				no_padding && styles.no_padding,
				as_label && styles.as_label
			)}
		>
			<Choose>
				<When condition={value === undefined}>
					<div className='level_items flex align_end'>
						{Array.from({ length: 3 }).map((_, index) => (
							<span className='level_item' key={index}></span>
						))}
					</div>
				</When>
				<When condition={(value as number) < 4}>
					<div className='level_items flex align_end'>
						{Array.from({ length: 3 }).map((_, index) => (
							<span
								className={$cx(
									'level_item',
									(value as number) >= index + 1 && 'active'
								)}
								key={index}
							></span>
						))}
					</div>
				</When>
				<Otherwise>
					<div className='urgent_wrap flex justify_center align_center'>
						<ExclamationMark weight='bold'></ExclamationMark>
					</div>
				</Otherwise>
			</Choose>
		</div>
	)
}

export default $app.memo(Index)
