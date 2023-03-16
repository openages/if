import { customAlphabet } from 'nanoid'

export default () => {
	return (
		customAlphabet('abcdefghijklmnopqrstuvwxyz', 15)() +
		customAlphabet('abcdefghijklmnopqrstuvwxyz_-0123456789', 15)()
	)
}
