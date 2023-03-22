import { Else, If, Then } from 'react-if'
import { ReactSortable } from 'react-sortablejs'

import { SimpleEmpty } from '@/components'

import DirItem from '../DirItem'

import type { IPropsDirItems } from '../../types'
import type { ReactSortableProps } from 'react-sortablejs'
import type { DirTree } from '@/types'

const sortable_options: Omit<ReactSortableProps<DirTree.Item>, 'list' | 'setList'> = {
	animation: 150,
	fallbackOnBody: true,
	swapThreshold: 0.72,
	group: 'dirtree'
}

const Index = (props: IPropsDirItems) => {
	const { module, data, current_item, fold_all, update, onClick, setFoldAll, showDirTreeOptions } = props

	return (
		<div className={$cx('dir_tree_wrap w_100 border_box flex flex_column', !data.length && 'empty')}>
			<If condition={data.length > 0}>
				<Then>
					<ReactSortable {...sortable_options} list={data} setList={update}>
						{data.map((item) => (
							<DirItem
								{...{
									module,
									item,
									current_item,
									fold_all,
									sortable_options,
									update,
									onClick,
									setFoldAll,
									showDirTreeOptions
								}}
								key={item.id}
							></DirItem>
						))}
					</ReactSortable>
				</Then>
				<Else>
					<SimpleEmpty></SimpleEmpty>
				</Else>
			</If>
		</div>
	)
}

export default $app.memo(Index)
