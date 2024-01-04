import { addRxPlugin } from 'rxdb'
import { RxDBFlexSearchPlugin } from 'rxdb-flexsearch'
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup'
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election'
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'

import { RxDBcrdtPlugin } from '@/utils/rxdb/plugins/crdt'

const plugins = [
	RxDBFlexSearchPlugin,
	RxDBCleanupPlugin,
	RxDBcrdtPlugin,
	RxDBLeaderElectionPlugin,
	RxDBMigrationPlugin,
	RxDBQueryBuilderPlugin,
	RxDBUpdatePlugin
]

plugins.forEach(item => addRxPlugin(item))

if (process.env.NODE_ENV !== 'production') {
	import('rxdb/plugins/dev-mode').then(({ RxDBDevModePlugin }) => addRxPlugin(RxDBDevModePlugin))
}
