import { SimpleEmpty } from '@/components'

import { Apps, Dirtree, Files, Header } from './components'
import styles from './index.css'

import type {
	IPropsHomeDrawer,
	IPropsHomeDrawerHeader,
	IPropsHomeDrawerFiles,
	IPropsHomeDrawerApps
} from '@/layout/types'
import type { App } from '@/types'

const Index = (props: IPropsHomeDrawer) => {
	const {
		tab,
		active,
		latest_files,
		star_files,
		setTab,
		setActive,
		showSetting,
		closeHome,
		setStar,
		onFile,
		onStarFilesDragEnd
	} = props

	const props_header: IPropsHomeDrawerHeader = {
		tab,
		setTab,
		showSetting,
		closeHome
	}

	const props_files: IPropsHomeDrawerFiles = {
		tab,
		files: tab === 'latest' ? latest_files : star_files,
		setStar,
		onFile,
		onStarFilesDragEnd
	}

	const props_apps: IPropsHomeDrawerApps = {
		active,
		setActive
	}

	return (
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
	)
}

export default $app.memo(Index)
