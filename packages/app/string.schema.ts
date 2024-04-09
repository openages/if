export interface Target {
	str?: string
}

export interface Schema {
	encode(message: Target): Uint8Array
	decode(buffer: Uint8Array): Target
}
