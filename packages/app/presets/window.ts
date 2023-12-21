import { Emittery, handle, memo } from '@openages/stk'
import cx from 'classix'
import copy from 'fast-copy'

import type { MessageInstance } from 'antd/es/message/interface'
import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import type { NotificationInstance } from 'antd/es/notification/interface'

window.$is_dev = process.env.NODE_ENV === 'development'

window.$app = {
	memo,
	handle,
	Event: new Emittery()
}

window.$t = (() => {}) as any
window.$copy = copy
window.$cx = cx
window.$navigate = (() => {}) as any

window.$message = {} as MessageInstance
window.$notification = {} as NotificationInstance
window.$modal = {} as Omit<ModalStaticFunctions, 'warn'>
