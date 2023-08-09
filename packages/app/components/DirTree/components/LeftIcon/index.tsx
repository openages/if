import { match } from 'ts-pattern'

import { Cube, DiceFour, ListBullets } from '@phosphor-icons/react'

import type { IPropsLeftIcon } from '../../types'

const Index = (props: IPropsLeftIcon) => {
	const { module, item } = props

	return match({ ...item, module })
		.with({ type: 'file', module: 'todo' }, () => <ListBullets size={18}  />)
		.with({ type: 'file' }, () => <Cube size={18} />)
		.with({ type: 'dir' }, () => <DiceFour size={18}/>)
		.otherwise(({ icon }) => <span>{icon}</span>)
}

export default $app.memo(Index)
