// Source - https://stackoverflow.com/a/5174867
// Posted by PleaseStand, modified by community. See post 'Timeline' for change history
// Retrieved 2026-05-11, License - CC BY-SA 4.0

export function getWordAt(str: string, pos: number) {
	// check ranges
	if (pos < 0 || pos > str.length) {
		return "";
	}
	// Perform type conversions.
	str = String(str);
	pos = Number(pos) >>> 0;

	// Search for the word's beginning and end.
	var left = str.slice(0, pos + 1).search(/\S+$/), // use /\S+\s*$/ to return the preceding word
		right = str.slice(pos).search(/\s/);

	// The last word in the string is a special case.
	if (right < 0) {
		return str.slice(left);
	}

	// Return the word, using the located bounds to extract it from the string.
	return str.slice(left, right + pos);
}

export function wordWithoutBrackets(word: string) {
	const result = /<?([A-Za-z_0-9]+)>?/.exec(word);
	if (!result) return;
	return result[1];
}
