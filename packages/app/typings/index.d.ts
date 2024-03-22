declare module '*.css'
declare module '*.png'
declare module '*.svg'
declare module '*.jpeg'

declare function If(props: { condition: boolean; children: React.ReactNode }): any
declare function Choose(props: { children: React.ReactNode }): any
declare function When(props: { condition: boolean; children: React.ReactNode }): any
declare function Otherwise(props: { children: React.ReactNode }): any
