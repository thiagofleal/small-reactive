import { Subject } from "../../rx.js";
import { getAllAttributesFrom, parseHTML } from "./functions.js";

function getNodeType(node) {
	if (node.nodeType === 3) return "text";
	if (node.nodeType === 8) return "comment";
	return node.tagName.toLowerCase();
}

function getNodeContent(node) {
	if (node.childNodes && node.childNodes.length > 0) return null;
	return node.textContent;
}

function diffAttributes(template, element) {
	const templateAttributes = getAllAttributesFrom(template);
	const elementAttributes = getAllAttributesFrom(element);

	for (const key in elementAttributes) {
		if (!template.getAttribute(key)) {
			element.removeAttribute(key);
		}
	}
	for (const key in templateAttributes) {
		if (template.getAttribute(key) !== element.getAttribute(key)) {
			element.setAttribute(key, template.getAttribute(key));
		}
	}
}

function diff(template, element, onAdd, onRemove, onAlter) {
	const domNodes = Array.prototype.slice.call(element.childNodes);
	const templateNodes = Array.prototype.slice.call(template.childNodes);
	let count = domNodes.length - templateNodes.length;

	if (count > 0) {
		for (; count > 0; count--) {
			const child = domNodes[domNodes.length - count];
			domNodes[domNodes.length - count].parentNode.removeChild(child);
			onRemove(child);
		}
	}
	templateNodes.forEach((node, index) => {
		if (!domNodes[index]) {
			const child = node.cloneNode(true);
			element.appendChild(child);
			onAdd(child);
			return;
		}
		if (getNodeType(node) !== getNodeType(domNodes[index])) {
			const child = node.cloneNode(true);
			const current = domNodes[index];
			domNodes[index].parentNode.replaceChild(child, current);
			onAlter(current, child);
			return;
		}
		const templateContent = getNodeContent(node);
		if (templateContent && templateContent !== getNodeContent(domNodes[index])) {
			domNodes[index].textContent = templateContent;
		}
		if (domNodes[index].childNodes.length > 0 && node.childNodes.length < 1) {
			domNodes[index].innerHTML = "";
			return;
		}
		if (domNodes[index].childNodes.length < 1 && node.childNodes.length > 0) {
			const fragment = document.createDocumentFragment();
			diff(node, fragment, onAdd, onRemove, onAlter);
			domNodes[index].appendChild(fragment);
			return;
		}
		if (node.childNodes.length > 0) {
			diff(node, domNodes[index]);
		}
		diffAttributes(node.parentElement, domNodes[index].parentElement);
	});
}

export class VirtualDom {
	#template = null;

	addElement$ = new Subject();
	removeElement$ = new Subject();
	alterElement$ = new Subject();

	load(template) {
		this.#template = parseHTML(template);
	}

	apply(element) {
		diff(
			this.#template,
			element,
			child => this.addElement$.next(child),
			child => this.addElement$.next(child),
			(previous, current) => this.addElement$.next({ previous, current })
		);
	}
}
