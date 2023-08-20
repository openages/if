import type { DirTree } from '../dirtree'
import type { App } from '../app'

export namespace Module {
      export interface Item {
		module: App.ModuleType
		dirtree: Array<DirTree.Item>
	}
}
