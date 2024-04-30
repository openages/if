import { bundledLanguagesInfo, getHighlighter } from 'shiki'

export default await getHighlighter({
	langs: bundledLanguagesInfo.map(item => item.id),
	themes: ['github-light', 'github-dark-dimmed']
})
