import { addRxPlugin } from 'rxdb'
import { RxDBFlexSearchPlugin } from 'rxdb-flexsearch'
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup'
import { RxDBcrdtPlugin } from 'rxdb/plugins/crdt'
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'

addRxPlugin(RxDBcrdtPlugin)
addRxPlugin(RxDBCleanupPlugin)
addRxPlugin(RxDBLeaderElectionPlugin)
addRxPlugin(RxDBUpdatePlugin)
addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(RxDBFlexSearchPlugin)

if (process.env.NODE_ENV !== 'production') {
	import('rxdb/plugins/dev-mode').then(({ RxDBDevModePlugin }) => addRxPlugin(RxDBDevModePlugin))
}
