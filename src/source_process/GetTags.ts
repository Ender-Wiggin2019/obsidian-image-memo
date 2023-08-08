export function getTags(source: string) {
	const regex = /#(\w+)/g;
	let match;
	const result = [];

	while ((match = regex.exec(source)) !== null) {
		result.push(match[1]);
	}

	return result;
}
