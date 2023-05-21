// const unidecode = require("unidecode");

export default function parseUrl(value: string): string {
  if (!value || value.includes("index.php")) return null;

  // value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  value = decodeURIComponent(value);

  return value;
}
