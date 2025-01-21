import { ExclamationMark } from '@phosphor-icons/react'

import styles from './index.css'

interface IProps {
	value?: number
}

const Index = (props: IProps) => {
	const { value } = props

	return (
		<div className={$cx('flex', styles._local)}>
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
