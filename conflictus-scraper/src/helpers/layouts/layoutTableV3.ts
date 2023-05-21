import { Battle } from "../../models/battle";
import parseText from "../parseText";
import parseYear from "../parseYear";
import parseUrl from "../parseUrl";

export async function layoutTableV3(document: Document): Promise<Array<Battle>> {
  const tables = document.querySelectorAll("table");

  let battles: Battle[] = [];

  //Crawl Tables
  for (const table of tables) {
    const rows = table.querySelectorAll("tr");
    let lastYear: number | undefined;
    let lastDate: string | undefined;

    for (const [i, row] of [...rows].entries()) {
      if (i === 0) continue; // skip headers row

      const colCount: number = row.querySelectorAll("td").length;

      let battle = new Battle();

      switch (colCount) {
        case 5:
          battle.year = lastYear;
          battle.title = parseText(row.children[0].textContent);
          battle.url = parseUrl(row.children[0]?.querySelector("a")?.getAttribute("href"));
          battle.description = null;
          break;

        default:
          let yearText = row.children[0].textContent.trim();
          if (yearText) {
            battle.year = lastYear = parseYear(yearText.slice(-4));
            battle.date = parseText(yearText);
          }

          battle.title = parseText(row.children[1].textContent);
          battle.url = parseUrl(row.children[1]?.querySelector("a")?.getAttribute("href"));
          battle.description = null;
          break;
      }

      battles.push(battle);
    }
  }

  return battles;
}
