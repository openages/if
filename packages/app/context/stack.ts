import { createContext, useContext } from 'react'

import type { App } from '@/types'

export interface StackContext {
	module: App.ModuleType
	id: string
	width: number
	container_width: number
	resizing: boolean
	breakpoint?: 801 | 390
}

// @ts-ignore Avoid duplicate declarations
export const StackContext = createContext<StackContext>()

export const useStack = () => useContext(StackContext)
