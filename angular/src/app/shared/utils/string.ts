export enum KeyboardCode {
	Backspace = "Backspace",
	Delete = "Delete"
}

export function format(text: string, args: unknown[]) {
	return text.replace(/{(\d+)}/g, function (match, number) {
		return typeof args[number] !== "undefined" ? args[number].toString() : match;
	});
}

export function isInputKeyValidNumber(event: KeyboardEvent) {
	if (event.code !== "Backspace" && event.code !== "Delete" && /[^0-9.]/.test(event.key)) {
		return false;
	} else {
		return true;
	}
}

export function validIntenger(event: KeyboardEvent) {
	return isInputKeyValidNumber(event) && event.key !== ".";
}

export function isStringValidIntenger(str: string): boolean {
	return /^\d+$/.test(str);
}

export function toCapital(str: string): string {
	let resultStr = "";
	if (str) {
		const words = str.split(" ");
		resultStr = words.map(word => word[0].toUpperCase() + word.slice(1)).join(" ");
	}
	return resultStr;

}

export function toLowerCaseFirstLetter(str: string): string {
	return str ? str.charAt(0).toLowerCase() + str.slice(1) : "";
}

export function toSentenceCase(str: string) {
	if (str) {
		const words = str.split(" ");
		const firstWord = toCapital(words[0]);
		words.shift();
		const mapedWords = words.map(word => toLowerCaseFirstLetter(word));
		mapedWords.unshift(firstWord);
		return mapedWords.join(" ");
	}

	return "";
}

export function replaceAll(str: string, search: string, replacement: string): string {
	return str.split(search).join(replacement);
}
// "String(str)" is protection, if "str" still isn't a string.
export function isEmptyNullOrUndefined(str: string): boolean {
	return str === ""
		|| str === null
		|| str === undefined
		|| (str && String(str).trim().length === 0);
}

export function translateFormat(value: string) {
	return value ? value
		.replace(/\s+/g, "")
		.replace(")", "")
		.replace("(", "")
		.replace("-", "")
		: " ";
}
