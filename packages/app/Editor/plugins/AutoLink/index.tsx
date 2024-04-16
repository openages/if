import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin'

import { matchers } from './utils'

const Index = () => {
	return <AutoLinkPlugin matchers={matchers} />
}

export default $app.memo(Index)
