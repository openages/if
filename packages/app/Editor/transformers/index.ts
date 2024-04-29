import { ELEMENT_TRANSFORMERS, TEXT_FORMAT_TRANSFORMERS } from '@lexical/markdown'

import Code from './Code'
import Divider from './Divider'
import Image from './Image'
import { Katex_block, Katex_inline } from './Latex'

export default [
	...ELEMENT_TRANSFORMERS.filter(item => item.regExp.source !== '^```(\\w{1,10})?\\s'),
	...TEXT_FORMAT_TRANSFORMERS,
	Image,
	Divider,
	Code,
	Katex_inline,
	Katex_block
]
