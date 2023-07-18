import { useState } from 'react'

import { useElementScrollRestoration } from '@/hooks'

const Index = () => {
	const [count, setCount] = useState(0)

	const scroller = useElementScrollRestoration('A')

	return (
		<div onClick={() => setCount(count + 1)}>
			<span>test {count}</span>
			<div style={{ width: '100%', height: 600, backgroundColor: 'red' }}></div>
			<div style={{ width: '100%', height: 900, backgroundColor: 'blue' }}></div>
		</div>
	)
}

export default Index
