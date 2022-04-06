export const copyToClipboard = (elementId:string) => {
	const el = document.getElementById(elementId);
	var range = document.createRange();
	var sel = window.getSelection();
	if (el && sel) {
		range.setStart(el, 0);
		range.setEndAfter(el);
		sel.removeAllRanges();
		sel.addRange(range);
		navigator.clipboard.writeText(sel.toString());
		sel.removeAllRanges();
	}
};
