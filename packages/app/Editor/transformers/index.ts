import { ELEMENT_TRANSFORMERS, TEXT_FORMAT_TRANSFORMERS } from '@lexical/markdown'

import Code from './Code'
import Divider from './Divider'
import Image from './Image'
import { Katex_block, Katex_inline } from './Katex'
import Quote from './Quote'

const exludes = ['^[ \\t]*```(\\w{1,10})?\\s', '^>\\s']

export default [
	...ELEMENT_TRANSFORMERS.filter(item => !exludes.includes(item.regExp.source)),
	...TEXT_FORMAT_TRANSFORMERS,
	Image,
	Divider,
	Code,
	Katex_inline,
	Katex_block,
	Quote
]
