import { conf, id } from '@/utils'
import { local } from '@openages/stk/storage'

if (window.$shell?.type === 'electron') {
	local.mid = await conf.get('mid')

	setTimeout(() => window.$shell?.stopLoading(), 30)
} else {
	if (!local.mid) local.mid = id()
}
