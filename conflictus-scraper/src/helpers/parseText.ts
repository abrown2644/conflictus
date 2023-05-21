export default function parseText(value: string): string {
  value = value.replace(/\n/g, ""); // removes \n
  value = value.replace(/\[[^\]]+\]/g, ""); // removes [*]
  return value;
}
