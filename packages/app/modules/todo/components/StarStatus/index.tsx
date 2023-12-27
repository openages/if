import { getColorByLevel } from '@/appdata'
import Color from 'color'
import styles from './index.css'

import type { IPropsStarStatus } from '../../types'

const Index = (props: IPropsStarStatus) => {
	const { star } = props
	const color = getColorByLevel(star)

	return (
		<div
			className={$cx('other_wrap border_box flex justify_center align_center', styles._local)}
			style={
				color
					? {
							color,
							backgroundColor: Color(color).alpha(0.24).toString()
					  }
					: null
			}
			dangerouslySetInnerHTML={{
				__html: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><polygon points="240 80 248 300 264 300 272 60 240 60" style="fill:none;stroke:${
					color || 'var(--color_text)'
				};stroke-linecap:square;stroke-miterlimit:10;stroke-width: 64px;"/><rect x="240" y="420" width="32" height="32" style="fill:none;stroke:${
					color || 'var(--color_text)'
				};stroke-linecap:square;stroke-miterlimit:10;stroke-width: 64px;"/></svg>`
			}}
		></div>
	)
}

export default $app.memo(Index)
