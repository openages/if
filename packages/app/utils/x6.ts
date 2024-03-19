import { memo as react_memo } from 'react'

import type { ReactShape } from '@antv/x6-react-shape'

type Element = JSX.Element | null

type Memo = <T>(
	el: (props: T & { node: ReactShape }) => Element
) => React.MemoExoticComponent<(props: T & { node: ReactShape }) => Element>

export const memo: Memo = el => {
	return react_memo(el, (_, next) => Boolean(next.node?.hasChanged('data')))
}
