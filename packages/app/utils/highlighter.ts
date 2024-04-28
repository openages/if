import { bundledLanguages, getHighlighter } from 'shiki'

export default await getHighlighter({
	langs: Object.keys(bundledLanguages),
	themes: ['github-light', 'github-dark-dimmed']
})
