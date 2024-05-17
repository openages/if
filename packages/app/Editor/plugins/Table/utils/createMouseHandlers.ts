import { isMouseDownOnEvent } from '@/Editor/utils'

import TableObserver from '../TableObserver'
import { getDOMCellFromTarget } from './index'

export default (observer: TableObserver) => {
	const on_mouse_move = (move_event: MouseEvent) => {
		setTimeout(() => {
			if (!isMouseDownOnEvent(move_event) && observer.selecting) {
				observer.selecting = false

				window.removeEventListener('mouseup', on_mouse_up)
				window.removeEventListener('mousemove', on_mouse_move)

				return
			}

			const focus_cell = getDOMCellFromTarget(move_event.target as Node)

			if (focus_cell !== null && observer.anchor_x !== focus_cell.x && observer.anchor_y !== focus_cell.y) {
				move_event.preventDefault()
				observer.setFocusCellForSelection(focus_cell)
			}
		}, 0)
	}

	const on_mouse_up = () => {
		observer.selecting = false

		window.removeEventListener('mouseup', on_mouse_up)
		window.removeEventListener('mousemove', on_mouse_move)
	}

	return { onMouseMove: on_mouse_move, onMouseUp: on_mouse_up }
}
