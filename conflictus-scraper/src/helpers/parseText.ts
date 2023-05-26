export default function parseText(value: string): string {
  if (!value) return null;

  value = value.replace(/\n/g, ""); // removes \n
  value = value.replace(/\[[^\]]+\]/g, ""); // removes [*]
  return value;
}
