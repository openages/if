import { Eraser, Notepad, Trash } from '@phosphor-icons/react'

import styles from '../index.css'

interface IProps {
	showDetailModal: () => void
	remove: () => void
	clean: () => void
}

const Index = (props: IProps) => {
	const { showDetailModal, remove, clean } = props

	return (
		<div className={$cx('flex justify_center align_center', styles.RenderOptions)}>
			<div
				className='btn_action flex justify_center align_center cursor_point clickable mr_2'
				onClick={showDetailModal}
			>
				<Notepad size={14}></Notepad>
			</div>
			<div
				className='btn_action flex justify_center align_center cursor_point clickable mr_2'
				onClick={remove}
			>
				<Trash size={14}></Trash>
			</div>
			<div className='btn_action flex justify_center align_center cursor_point clickable' onClick={clean}>
				<Eraser size={14}></Eraser>
			</div>
		</div>
	)
}

export default $app.memo(Index)
