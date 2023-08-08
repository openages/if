import cx from 'classix'
import EventEmitter from 'emittery'

import { handle, memo } from '@openages/craftkit'

import type { MessageInstance } from 'antd/es/message/interface'
import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import type { NotificationInstance } from 'antd/es/notification/interface'

window.$is_dev = process.env.NODE_ENV === 'development'

window.$app = {
	memo,
	handle,
	Event: new EventEmitter()
}

window.$cx = cx
window.$t = (() => {}) as any
window.$message = {} as MessageInstance
window.$notification = {} as NotificationInstance
window.$modal = {} as Omit<ModalStaticFunctions, 'warn'>
