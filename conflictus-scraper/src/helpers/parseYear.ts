export default function parseYear(value: string): number {
  value = value.toLowerCase();

  // clean it up
  let isBC = value.includes("bc");
  value = value.replace("bc", "");
  value = value.replace("c.", "");
  value = value.replace("–", "");
  value = value.replace("\n", "");
  value = value.split("-")[0];
  value = value.replace(/\s/g, ""); // remove spaces

  if (isBC) {
    value = "-" + value;
  }

  return parseInt(value);
}
