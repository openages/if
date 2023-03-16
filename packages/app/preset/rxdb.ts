import { addRxPlugin } from 'rxdb'
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'

addRxPlugin(RxDBCleanupPlugin)
addRxPlugin(RxDBUpdatePlugin)
addRxPlugin(RxDBQueryBuilderPlugin)

if (process.env.NODE_ENV !== 'production') {
	import('rxdb/plugins/dev-mode').then(({ RxDBDevModePlugin }) => addRxPlugin(RxDBDevModePlugin))
}
