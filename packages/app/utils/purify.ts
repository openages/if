import { sanitize } from 'dompurify'

export const purify = (text: string) => {
	return sanitize(text, {
		ALLOWED_TAGS: ['span', 'a']
	})
}
