import { useClickAway, useMemoizedFn, useToggle } from 'ahooks'
import { useRef } from 'react'

import { Show } from '@/components'
import Input from '@/layout/components/Search/components/Input'
import Result from '@/layout/components/Search/components/Result'

import styles from './index.css'

import type { IPropsSearchInputRef } from '@/layout/types'
import type { IPropsSearch } from '../../types'

const Index = (props: IPropsSearch) => {
	const { props_input, props_result } = props
	const ref = useRef<IPropsSearchInputRef>(null)
	const ref_result = useRef<HTMLDivElement>(null)
	const [visible, { set }] = useToggle()

	useClickAway(() => {
		set(false)
	}, [ref.current?.input, ref_result])

	const showResult = useMemoizedFn(() => set(true))
	const hideResult = useMemoizedFn(() => set(false))

	return (
		<div className={$cx('w_100 flex justify_center relative', styles._local)}>
			<Input
				className='input_search_wrap border_box'
				search_ref={ref}
				showResult={showResult}
				{...props_input}
			></Input>
			<Show
				className='result_wrap border_box absolute'
				visible={visible && props.props_result.items.length > 0}
				dom_ref={ref_result}
			>
				<Result text={ref.current?.text!} hideResult={hideResult} {...props_result}></Result>
			</Show>
		</div>
	)
}

export default $app.memo(Index)
