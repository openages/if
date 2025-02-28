import { useLayoutEffect } from 'react'

import { createDeepCompareEffect } from '@openages/stk/react'

// @ts-ignore
export default createDeepCompareEffect(useLayoutEffect)
