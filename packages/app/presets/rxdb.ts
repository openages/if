import { addRxPlugin } from 'rxdb'
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup'
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election'
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'

import { RxDBcrdtPlugin } from '@/utils/rxdb/plugins/crdt'

const plugins = [
	RxDBCleanupPlugin,
	RxDBcrdtPlugin,
	RxDBLeaderElectionPlugin,
	RxDBMigrationPlugin,
	RxDBQueryBuilderPlugin,
	RxDBUpdatePlugin
]

plugins.forEach(item => addRxPlugin(item))

if (process.env.NODE_ENV !== 'production') {
	// @ts-ignore
	import('rxdb/plugins/dev-mode').then(({ RxDBDevModePlugin, disableWarnings }) => {
		disableWarnings()
		addRxPlugin(RxDBDevModePlugin)
	})
}
