import { customAlphabet } from 'nanoid'

export default () => {
	return (
		customAlphabet('abcdefghijklmnopqrstuvwxyz', 15)() +
		customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789_-', 15)()
	)
}
