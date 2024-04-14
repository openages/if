export default (target: Window | Document | null) => (target || window).getSelection()
