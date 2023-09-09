import 'react'

declare module 'react' {
	export const unstable_Offscreen: ComponentClass<
		{
			children: ReactNode
			mode: 'hidden' | 'visible'
		},
		any
	>

	interface DragEvent {
		offsetX: number
		offsetY: number
	}
}
