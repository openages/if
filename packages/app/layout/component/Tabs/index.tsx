import { useEffect } from 'react'
import { If, Then, Else } from 'react-if'

import { Logo } from '@/components'
import { useCurrentModule } from '@/hooks'

import { NavBar, Content } from './components'
import styles from './index.css'

import type { IPropsTabs, IPropsTabsNavBar, IPropsTabsContent } from '../../types'

const Index = (props: IPropsTabs) => {
	const { stacks, remove, active, update, move } = props
	const module = useCurrentModule()

	useEffect(() => {
		const active_item = stacks.find((item) => item.is_active)

		$app.Event.emit(`${module}/dirtree/setCurrentItem`, active_item ? active_item.file : {})
	}, [module, stacks])

	const props_nav_bar: IPropsTabsNavBar = {
		stacks,
		remove,
		active,
		update,
		move
	}

	const props_content: IPropsTabsContent = {
		stacks
	}

	return (
		<div className='w_100 border_box flex flex_column'>
			<If condition={stacks.length}>
				<Then>
					<NavBar {...props_nav_bar}></NavBar>
					<div className={$cx('w_100', styles.content_wrap)}>
						<Content {...props_content}></Content>
					</div>
				</Then>
				<Else>
					<div className={'w_100 h_100vh flex justify_center align_center'}>
						<Logo size={84}></Logo>
					</div>
				</Else>
			</If>
		</div>
	)
}

export default $app.memo(Index)
