import to from 'await-to-js'
import mermaid from 'mermaid'

import { id } from '@/utils'
import { local } from '@openages/stk/storage'

export default async (value: string, container: HTMLElement) => {
	mermaid.initialize({ theme: local.theme === 'dark' ? 'dark' : 'default' })

	const [err, res] = await to(mermaid.render(id(), value, container))

	if (err) return

	container.innerHTML = res.svg
}
