import { Battle } from "../../models/battle";
import parseText from "../parseText";
import parseYear from "../parseYear";
import parseUrl from "../parseUrl";

export async function layoutTableV2(document: Document): Promise<Array<Battle>> {
  const tables = document.querySelectorAll("table.wikitable");
  let battles: Battle[] = [];

  //Crawl Tables V2
  for (const table of tables) {
    const rows = table.querySelectorAll("tr");
    let lastYear: number | undefined;

    for (const [i, row] of [...rows].entries()) {
      if (i === 0) continue; // skip headers row

      const colCount: number = row.querySelectorAll("td").length;

      let battle = new Battle();

      switch (colCount) {
        case 3:
          battle.year = lastYear;
          battle.title = parseText(row.children[0].textContent);
          battle.url = parseUrl(row.children[0]?.querySelector("a")?.getAttribute("href"));
          battle.description = parseText(row.children[2].textContent);
          break;

        default:
          let yearText = row.children[0].textContent;
          if (yearText) battle.year = lastYear = parseYear(yearText);

          battle.title = parseText(row.children[1]?.textContent) || null;
          battle.url = parseUrl(row.children[1]?.querySelector("a")?.getAttribute("href"));
          battle.description = parseText(row.children[3].textContent);
          break;
      }

      battles.push(battle);
    }
  }

  return battles;
}
