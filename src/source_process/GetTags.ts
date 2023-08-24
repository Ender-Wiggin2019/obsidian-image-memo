export function getTags(source: string) {
  const regex = /#(\w+)/g;
  let match;
  const result = [];

  while ((match = regex.exec(source)) !== null) {
    const tag = match[1];
    result.push(tag.replace(tag[0], tag[0].toUpperCase())); // capitalize the first letter
  }

  return result;
}
