import to from 'await-to-js'
import { dropRight } from 'lodash-es'
import PouchDB from 'pouchdb'
import PouchDBDebug from 'pouchdb-debug'
import PouchDBFind from 'pouchdb-find'

import { nav_items, widgets } from '@/appdata'

PouchDB.plugin(PouchDBFind)

if (process.env.NODE_ENV === 'development') {
	// PouchDB.plugin(PouchDBDebug)
	// PouchDB.debug.enable('*')
}

const db = new PouchDB('if', { auto_compaction: true, revs_limit: 100 })

// const preset_data = [...dropRight(nav_items), ...widgets]

// db.allDocs({ include_docs: true }).then((res) => {
//       console.log(res)
// })

// db.get('todo')
// 	.then()
// 	.catch(() => db.bulkDocs(preset_data.map((item) => ({ _id: item.title, data: [] }))))

export default {}
