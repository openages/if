import { useToggle } from 'ahooks'
import { Fragment } from 'react/jsx-runtime'

import { Drawer } from '@/components'
import { Image } from '@phosphor-icons/react'

import { bgs } from '../../model'
import styles from './index.css'

import type { IPropsBgSelect } from '../../types'

const Index = (props: IPropsBgSelect) => {
	const { id, bg_index, setBgIndex } = props
	const [visible, { toggle }] = useToggle()

	return (
		<Fragment>
			<div
				className={$cx('absolute flex justify_center align_center clickable', styles.btn_bg_select)}
				onClick={toggle}
			>
				<Image weight='fill'></Image>
			</div>
			<Drawer
				maskClosable
				placement='bottom'
				height='auto'
				open={visible}
				onCancel={toggle}
				getContainer={() => document.getElementById(id ?? 'body')!}
			>
				<div className={$cx('w_100 flex', styles._local)}>
					{bgs.map((item, index) => (
						<div
							className={$cx('img_wrap flex clickable', bg_index === index && 'active')}
							key={index}
							onClick={() => setBgIndex(index)}
						>
							<img className='w_100' src={item} alt='bg' />
						</div>
					))}
				</div>
			</Drawer>
		</Fragment>
	)
}

export default $app.memo(Index)
