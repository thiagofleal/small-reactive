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
	let changes = 0;

	for (const key in elementAttributes) {
		if (!template.getAttribute(key)) {
			element.removeAttribute(key);
			changes++;
		}
	}
	for (const key in templateAttributes) {
		if (template.getAttribute(key) !== element.getAttribute(key)) {
			element.setAttribute(key, template.getAttribute(key));
			changes++;
		}
	}
	return changes;
}

function diff(template, element, ignore) {
	const domNodes = Array.from(element.childNodes);
	const templateNodes = Array.from(template.childNodes);
	let count = domNodes.length - templateNodes.length;
	let changes = 0;

	if (count > 0) {
		for (; count > 0; count--) {
			const child = domNodes[domNodes.length - count];
			domNodes[domNodes.length - count].parentNode.removeChild(child);
			changes++;
		}
	}
	templateNodes.forEach((node, index) => {
		if (!domNodes[index]) {
			const child = node.cloneNode(true);
			element.appendChild(child);
			changes++;
			return;
		}
		if (getNodeType(node) !== getNodeType(domNodes[index])) {
			const child = node.cloneNode(true);
			const current = domNodes[index];
			domNodes[index].parentNode.replaceChild(child, current);
			changes++;
			return;
		}
		if (node instanceof HTMLElement) {
			if (ignore.some(i => node.matches(i))) {
				changes += (diffAttributes(node, domNodes[index]) ? 1 : 0);
				return;
			}
		}
		const templateContent = getNodeContent(node);
		if (templateContent && templateContent !== getNodeContent(domNodes[index])) {
			domNodes[index].textContent = templateContent;
			changes++;
		}
		if (domNodes[index].childNodes.length > 0 && node.childNodes.length < 1) {
			domNodes[index].innerHTML = "";
			changes++;
			return;
		}
		if (domNodes[index].childNodes.length < 1 && node.childNodes.length > 0) {
			const fragment = document.createDocumentFragment();
			changes += diff(node, fragment, ignore);
			domNodes[index].appendChild(fragment);
			changes++;
			return;
		}
		if (node.childNodes.length > 0) {
			changes += diff(node, domNodes[index], ignore);
		}
		if (node instanceof HTMLElement && domNodes[index] instanceof HTMLElement) {
			changes += (diffAttributes(node, domNodes[index]) ? 1 : 0);
		}
	});
	return changes;
}

export class VirtualDom {
	#template = null;
	#ignore = [];

	get template() {
		return this.#template;
	}

	get ignore() {
		return this.#ignore;
	}
	set ignore(value) {
		if (Array.isArray(value) && value.every(e => typeof e === "string")) {
			this.#ignore = value;
		}
	}

	load(template) {
		this.#template = parseHTML(template);
	}

	#assignAttributes(attributes, element) {
		if (!element) {
			element = this.#template;
		}
		if (element instanceof HTMLElement) {
			for (let attr in attributes) {
				element.setAttribute(attr, attributes[attr]);
			}
			element.childNodes.forEach(e => this.#assignAttributes(attributes, e));
		}
	}

	apply(element, attributes) {
		this.#assignAttributes(attributes);
		return diff(this.#template, element, this.#ignore);
	}
}
