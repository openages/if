import scrollIntoView from 'smooth-scroll-into-view-if-needed'

export default (container: HTMLElement, selector: string) => {
	setTimeout(() => {
		const target_dom = container.querySelector(selector)

		if (!target_dom) return

		scrollIntoView(target_dom, { block: 'center', behavior: 'smooth', boundary: container })

		target_dom.classList.add('notice_text')

		setTimeout(() => {
			target_dom.classList.remove('notice_text')
		}, 3000)
	}, 300)
}
