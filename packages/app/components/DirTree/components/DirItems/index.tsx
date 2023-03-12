import { Else, If, Then } from 'react-if'

import { SimpleEmpty } from '@/components'

import DirItem from '../DirItem'

import type { IPropsDirItems } from '../../types'

const Index = (props: IPropsDirItems) => {
	const { data, current_item, fold_all, onClick, setFoldAll } = props

	return (
		<div className='dir_tree_wrap w_100 border_box flex flex_column'>
			<If condition={data?.length}>
				<Then>
					{data.map((item) => (
						<DirItem
							{...item}
							{...{ current_item, fold_all, onClick, setFoldAll }}
							key={item._id}
						></DirItem>
					))}
				</Then>
				<Else>
					<SimpleEmpty></SimpleEmpty>
				</Else>
			</If>
		</div>
	)
}

export default $app.memo(Index)
