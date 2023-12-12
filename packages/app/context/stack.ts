import { createContext, useContext } from 'react'

import type { App } from '@/types'

export interface StackContext {
	module: App.ModuleType
	id: string
	width: number
}

// @ts-ignore Avoid duplicate declarations
export const StackContext = createContext<StackContext>()

export const useStack = () => useContext(StackContext)
