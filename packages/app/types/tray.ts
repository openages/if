export namespace Tray {
	export interface Setting {
		todo: {
			open: boolean
			file_id: string
			angle_id: string
		}
		schedule: {
			open: boolean
			file_id: string
		}
	}
}
