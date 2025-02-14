import { useState } from 'react'

import { BottomModal } from '@/components'

import { Dirtree, Files, Header } from './components'
import styles from './index.css'

import type { IPropsHomepage, IPropsHomepageHeader } from '@/layout/types'
import type { App } from '@/types'

const Index = (props: IPropsHomepage) => {
	const { visible_homepage, apps, latest_files, star_files, showSetting, closeHomepage } = props
	const [active, setActive] = useState<'latest' | 'star' | App.ModuleType>('todo')

	const props_modal_homepage = {
		bodyClassName: styles.modal_homepage,
		open: visible_homepage,
		maskClosable: true,
		width: 'min(600px,64vw)',
		zIndex: 1999,
		onCancel: closeHomepage
	}

	const props_header: IPropsHomepageHeader = {
		apps,
		active,
		setActive,
		showSetting,
		closeHomepage
	}

	return (
		<BottomModal {...props_modal_homepage}>
			<div className={$cx('w_100 border_box flex flex_column', styles._local)}>
				<Header {...props_header}></Header>
				<Choose>
					<When condition={active === 'latest' || active === 'star'}>
						<Files></Files>
					</When>
					<Otherwise>
						<Dirtree active={active as App.ModuleType}></Dirtree>
					</Otherwise>
				</Choose>
			</div>
		</BottomModal>
	)
}

export default $app.memo(Index)
