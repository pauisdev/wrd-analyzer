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

export function lineWithoutBrackets(word: string) {
	const result = /<?([A-Za-z_0-9 ]+)>?/.exec(word);
	if (!result) return;
	return result[1];
}

export function getOpCodeFromLine(line: string) {
	const firstWord = line.split(" ")[0];

	return firstWord.slice(1);
}

// Source - https://stackoverflow.com/a/58403800
// Posted by t-mart, modified by community. See post 'Timeline' for change history
// Retrieved 2026-05-11, License - CC BY-SA 4.0

function getWordBoundsAtPosition(str: string, position: number) {
	const isSpace = (c: string) => /\s/.exec(c);
	let start = position - 1;
	let end = position;

	while (start >= 0 && !isSpace(str[start])) {
		start -= 1;
	}
	start = Math.max(0, start + 1);

	while (end < str.length && !isSpace(str[end])) {
		end += 1;
	}
	end = Math.max(start, end);

	return [start, end];
}

export function cursorPositionToWordIndex(line: string[], position: number) {
	const [start, _end] = getWordBoundsAtPosition(line.join(" "), position);
	let count = 0;
	for (let i = 0; i < line.length; i++) {
		const word = line[i];
		for (let n = 0; n < Math.max(word.length, 1); n++) {
			count++;
			if (count === start) return i;
		}
	}
}
