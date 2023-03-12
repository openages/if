import to from 'await-to-js'
import { dropRight } from 'lodash-es'
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'

import { nav_items, widgets } from '@/appdata'

PouchDB.plugin(PouchDBFind)

const db = new PouchDB('If/db')
const preset_data = [...dropRight(nav_items), ...widgets]

db.get('todo')
	.then()
	.catch(() => db.bulkDocs(preset_data.map((item) => ({ _id: item.title, data: [] }))))

export default db
