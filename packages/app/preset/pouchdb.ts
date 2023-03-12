import { dropRight } from 'lodash-es'
import PouchDB from 'pouchdb'
import PouchDBIndexedDB from 'pouchdb-adapter-indexeddb'
import PouchDBDebug from 'pouchdb-debug'
import PouchDBFind from 'pouchdb-find'

import { nav_items, widgets } from '@/appdata'

PouchDB.plugin(PouchDBIndexedDB)
PouchDB.plugin(PouchDBFind)

if (process.env.NODE_ENV === 'development') {
	// PouchDB.plugin(PouchDBDebug)
	// PouchDB.debug.enable('*')
}

const db = new PouchDB('IF/DB', { adapter: 'indexeddb', auto_compaction: true, revs_limit: 100 })

const preset_data = [...dropRight(nav_items), ...widgets]

db.get('todo')
	.then()
	.catch(() => db.bulkDocs(preset_data.map((item) => ({ _id: item.title, data: [] }))))

export default db
