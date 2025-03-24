import { useAsyncEffect } from 'ahooks'
import { useState } from 'react'
import { match } from 'ts-pattern'

import { DirTree, LoadingCircle } from '@/components'

import styles from './index.css'

import type { IPropsDirTree } from '@/components'
import type { IPropsHomeDrawerDirtree } from '@/layout/types'

const getActions = async (active: IPropsHomeDrawerDirtree['active']) => {
	return match(active)
		.with('todo', async () => {
			const { insertSetting, remove } = await import('@/actions/todo')

			return { insert: insertSetting, remove }
		})
		.with('note', async () => {
			const { remove } = await import('@/actions/note')

			return { remove }
		})
		.with('pomo', async () => {
			const { insert, remove } = await import('@/actions/pomo')

			return { insert, remove }
		})
		.with('schedule', async () => {
			const { insertSetting, remove } = await import('@/actions/schedule')

			return { insert: insertSetting, remove }
		})
		.otherwise(() => {})
}

const Index = (props: IPropsHomeDrawerDirtree) => {
	const { active } = props
	const [actions, setActions] = useState<IPropsDirTree['actions'] | null>(null)

	useAsyncEffect(async () => {
		const target = (await getActions(active))!

		setActions(target)
	}, [active])

	if (!actions) {
		return (
			<div className={$cx('w_100 flex justify_center align_center', styles.loading_wrap)}>
				<LoadingCircle></LoadingCircle>
			</div>
		)
	}

	return (
		<div className={$cx(styles._local)}>
			{Object.keys(actions).length && <DirTree module={active} actions={actions}></DirTree>}
		</div>
	)
}

export default $app.memo(Index)
