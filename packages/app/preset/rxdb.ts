import { addRxPlugin } from 'rxdb'
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup'
import { RxDBcrdtPlugin } from 'rxdb/plugins/crdt'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'

addRxPlugin(RxDBCleanupPlugin)
addRxPlugin(RxDBUpdatePlugin)
addRxPlugin(RxDBcrdtPlugin)

if (process.env.NODE_ENV !== 'production') {
	import('rxdb/plugins/dev-mode').then(({ RxDBDevModePlugin }) => addRxPlugin(RxDBDevModePlugin))
}
