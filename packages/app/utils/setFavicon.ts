export default (color_main: string) => {
	const favicon = document.getElementById('favicon')
	const svg = `<svg id="if_favicon" xmlns="http://www.w3.org/2000/svg" width="390" height="390" viewBox="0 0 390 390"><defs><style>:root{--color_main:${color_main}} .cls-2{fill:#fff}</style></defs><rect x="3" y="3" width="384" height="384" rx="72" ry="72" fill="var(--color_main)"/><path class="cls-2" d="M92 91h40v40H92zM92 133h40v40H92zM92 175h40v40H92zM92 217h40v40H92zM92 259h40v40H92z"/><g><path class="cls-2" d="M174 91h40v40h-40zM174 133h40v40h-40zM174 175h40v40h-40zM174 217h40v40h-40zM174 259h40v40h-40z"/><g><path class="cls-2" d="M216 175h40v40h-40zM258 175h40v40h-40z"/></g><g><path class="cls-2" d="M216 91h40v40h-40zM258 91h40v40h-40z"/></g></g></svg>`

	favicon?.setAttribute('href', 'data:image/svg+xml;base64,' + btoa(svg))
}
