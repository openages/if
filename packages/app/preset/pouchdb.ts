import to from 'await-to-js'
import { dropRight } from 'lodash-es'
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'

import { nav_items, widgets } from '@/appdata'

import type { Doc } from '@/types'

PouchDB.plugin(PouchDBFind)

const db = new PouchDB<Doc.Content>('If/db')
const preset_data = [...dropRight(nav_items), ...widgets]

db.get('todo')
	.then()
      .catch(() => db.bulkDocs(preset_data.map((item) => ({ _id: item.title as any, data: [] }))))
      
export default db
