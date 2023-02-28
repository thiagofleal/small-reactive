export function parseHTML(str) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(str, "text/html");
	return doc.body;
}

export function getAllAttributesFrom(element) {
	const attributes = {};
	Array.from(element.attributes).forEach(attr => {
		attributes[attr.nodeName] = attr.nodeValue;
	});
	return attributes;
}

export function randomString(length, chars) {
	if (chars === undefined) {
		chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789"
	}
	let ret = "";
	for (let i = 0; i < length; i++) {
		ret += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return ret;
}
