import transformers from '@/Editor/transformers'
import { $convertFromPasteString } from '@/Editor/utils'

export default (text: string) => $convertFromPasteString(text, transformers)
