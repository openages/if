import { addRxPlugin } from 'rxdb'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'

addRxPlugin(RxDBUpdatePlugin)

if (process.env.NODE_ENV !== 'production') {
	import('rxdb/plugins/dev-mode').then(({ RxDBDevModePlugin }) => addRxPlugin(RxDBDevModePlugin))
}
