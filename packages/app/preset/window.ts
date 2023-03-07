import cx from 'classix'
import EventEmitter from 'emittery'

import { handle, memo } from '@matrixages/knife/react'

window.$app = {
	memo,
	handle,
	Event: new EventEmitter()
}

window.$l = {} as any
window.$cx = cx
