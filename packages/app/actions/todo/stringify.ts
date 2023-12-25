import schema_todo from '@/schemas/output/todo'
import fastJson from 'fast-json-stringify'

import { makeMutable } from '@/utils/types'

export default fastJson(makeMutable(schema_todo['Todo.Setting']))
