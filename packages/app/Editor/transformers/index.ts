import { ELEMENT_TRANSFORMERS, TEXT_FORMAT_TRANSFORMERS } from '@lexical/markdown'

import Divider from './Divider'
import Image from './Image'

export default [...ELEMENT_TRANSFORMERS, ...TEXT_FORMAT_TRANSFORMERS, Image, Divider]
