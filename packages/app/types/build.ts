export type HistoryType = 'browser' | 'hash' | 'memory'
export type BuildTarget = 'electron' | 'cordova'
export type SpBuildConfig = { base: string; history_type: HistoryType }
