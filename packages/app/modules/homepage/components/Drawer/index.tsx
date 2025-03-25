import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Drawer } from '@/components'
import { Dirtree, Files } from '@/layout/components/HomeDrawer/components'

import type { IPropsDrawer } from '../../types'
import type { IPropsHomeDrawerFiles } from '@/layout/types'

const Index = (props: IPropsDrawer) => {
	const {
		id,
		drawer_type,
		drawer_visible,
		module_type,
		files_type,
		files,
		setStar,
		onFile,
		onStarFilesDragEnd,
		onClose
	} = props
	const { t } = useTranslation()

	const props_files: IPropsHomeDrawerFiles = {
		tab: files_type,
		files,
		setStar,
		onFile,
		onStarFilesDragEnd
	}

	const title = useMemo(() => {
		if (!drawer_type) return

		if (drawer_type === 'dirtree') {
			return t(`modules.${module_type}`)
		} else {
			return t(`layout.Home.${files_type}`)
		}
	}, [t, drawer_type, module_type, files_type])

	return (
		<Drawer
			maskClosable
			placement='right'
			title={title}
			width={300}
			open={drawer_visible}
			onCancel={onClose}
			getContainer={() => document.getElementById(id ?? 'body')!}
		>
			<Choose>
				<When condition={drawer_type === 'dirtree'}>
					<Dirtree active={module_type}></Dirtree>
				</When>
				<When condition={drawer_type === 'files'}>
					<Files {...props_files}></Files>
				</When>
			</Choose>
		</Drawer>
	)
}

export default $app.memo(Index)
