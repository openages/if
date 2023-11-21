import { addRxPlugin } from 'rxdb'
import { RxDBFlexSearchPlugin } from 'rxdb-flexsearch'
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup'
import { RxDBcrdtPlugin } from 'rxdb/plugins/crdt'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'

addRxPlugin(RxDBCleanupPlugin)
addRxPlugin(RxDBcrdtPlugin)
addRxPlugin(RxDBUpdatePlugin)
addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(RxDBFlexSearchPlugin)

if (process.env.NODE_ENV !== 'production') {
	import('rxdb/plugins/dev-mode').then(({ RxDBDevModePlugin }) => addRxPlugin(RxDBDevModePlugin))
}
