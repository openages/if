import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { container } from 'tsyringe'

import { useGlobal } from '@/context/app'
import { useStackEffect } from '@/hooks'

import { Apps, Bg, BgSelect, Drawer, Search } from './components'
import styles from './index.css'
import Model from './model'

import type { IProps, IPropsBg, IPropsApps, IPropsBgSelect, IPropsDrawer, IPropsSearch } from './types'
import type { Stack } from '@/types'

const Index = ({ id }: IProps) => {
	const [x] = useState(() => container.resolve(Model))
	const global = useGlobal()

	const { setDom } = useStackEffect({
		mounted: () => x.init(),
		unmounted: () => x.off(),
		deps: [],
		stack_id: '__homepage__'
	})

	const props_bg: IPropsBg = {
		bg_index: x.bg_index
	}

	const props_search: IPropsSearch = {
		props_input: {
			module: $copy(global.search.module),
			items: $copy(global.search.items),
			index: $copy(global.search.index),
			setModule: useMemoizedFn(v => {
				global.search.items = []
				global.search.index = 0
				global.search.module = v
			}),
			searchByInput: useMemoizedFn(global.search.searchByInput),
			onClose: useMemoizedFn(global.search.closeSearch),
			onCheck: useMemoizedFn(global.search.onCheck),
			changeSearchIndex: useMemoizedFn(global.search.changeSearchIndex),
			clearSearchHistory: useMemoizedFn(global.search.clearSearchHistory)
		},
		props_result: {
			module: $copy(global.search.module),
			items: $copy(global.search.items),
			index: $copy(global.search.index),
			onCheck: useMemoizedFn(global.search.onCheck),
			changeSearchIndex: useMemoizedFn(global.search.changeSearchIndex)
		}
	}

	const props_apps: IPropsApps = {
		id,
		apps: $copy(global.app.apps)
	}

	const props_bg_select: IPropsBgSelect = {
		id,
		bg_index: x.bg_index,
		setBgIndex: useMemoizedFn(v => (x.bg_index = v))
	}

	const props_drawer: IPropsDrawer = {
		id,
		drawer_type: x.drawer_type,
		drawer_visible: x.drawer_visible,
		module_type: x.module_type,
		files_type: x.files_type,
		files: x.files_type === 'star' ? global.app.star_files : global.app.latest_files,
		setStar: useMemoizedFn(global.app.setStar),
		onFile: useMemoizedFn(v => {
			$app.Event.emit('global.stack.add', {
				id: v.id,
				module: v.module,
				file: $copy(v),
				active: true,
				fixed: false,
				outlet: null
			} as Stack.View)
		}),
		onStarFilesDragEnd: useMemoizedFn(global.app.onStarFilesDragEnd),
		onClose: useMemoizedFn(() => (x.drawer_visible = false))
	}

	return (
		<div className={$cx('w_100 h_100 border_box flex flex_column relative', styles._local)} ref={setDom}>
			<Bg {...props_bg}></Bg>
			<Search {...props_search}></Search>
			<Apps {...props_apps}></Apps>
			<BgSelect {...props_bg_select}></BgSelect>
			<Drawer {...props_drawer}></Drawer>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
