import { Drawer, SimpleEmpty } from '@/components'

import { Apps, Dirtree, Files, Header } from './components'
import styles from './index.css'

import type { IPropsHomepage, IPropsHomepageHeader, IPropsHomepageFiles, IPropsHomepageApps } from '@/layout/types'
import type { App } from '@/types'
const Index = (props: IPropsHomepage) => {
	const {
		visible_homepage,
		tab,
		active,
		apps,
		latest_files,
		star_files,
		setTab,
		setActive,
		showSetting,
		closeHomepage,
		setStar,
		onFile
	} = props

	const props_modal_homepage = {
		bodyClassName: styles.modal,
		open: visible_homepage,
		maskClosable: true,
		width: 'min(240px,36vw)',
		zIndex: 1999,
		onCancel: closeHomepage
	}

	const props_header: IPropsHomepageHeader = {
		tab,
		setTab,
		showSetting,
		closeHomepage
	}

	const props_files: IPropsHomepageFiles = {
		tab,
		files: tab === 'latest' ? latest_files : star_files,
		setStar,
		onFile
	}

	const props_apps: IPropsHomepageApps = {
		apps,
		active,
		setActive
	}

	return (
		<Drawer {...props_modal_homepage}>
			<div className={$cx('w_100 h_100 border_box flex flex_column', styles._local)}>
				<Header {...props_header}></Header>
				<Choose>
					<When condition={tab === 'latest' || tab === 'star'}>
						<Choose>
							<When condition={props_files.files.length === 0}>
								<div className='files_empty flex justify_center align_center'>
									<SimpleEmpty></SimpleEmpty>
								</div>
							</When>
							<Otherwise>
								<Files {...props_files}></Files>
							</Otherwise>
						</Choose>
					</When>
					<Otherwise>
						<Apps {...props_apps}></Apps>
						<Dirtree active={active as App.ModuleType}></Dirtree>
					</Otherwise>
				</Choose>
			</div>
		</Drawer>
	)
}

export default $app.memo(Index)
