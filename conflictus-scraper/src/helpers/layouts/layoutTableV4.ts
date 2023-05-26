import { Battle } from "../../models/battle";
import parseText from "../parseText";
import parseYear from "../parseYear";
import parseUrl from "../parseUrl";

export async function layoutTableV4(document: Document): Promise<Array<Battle>> {
  const tables = document.querySelectorAll("table.wikitable");

  let battles: Battle[] = [];

  //Crawl Tables v4
  for (const table of tables) {
    //get year from above each table
    const yearNodeText = table.previousElementSibling.firstChild.textContent.trim();
    const rows = table.querySelectorAll("tr");
    let lastYear: number | undefined;
    let lastDate: string | undefined;

    for (const [i, row] of [...rows].entries()) {
      if (i === 0) continue; // skip headers row

      const colCount: number = row.querySelectorAll("td").length;

      let battle = new Battle();

      switch (colCount) {
        default:
          battle.title = parseText(row.children[0].textContent);
          battle.url = parseUrl(row.children[0]?.querySelector("a")?.getAttribute("href"));

          let yearText = row.children[1].textContent;
          if (yearText) {
            battle.year = lastYear = parseYear(yearNodeText);
            battle.date = parseText(yearText);
          }

          battle.description = null;
          break;
      }

      battles.push(battle);
    }
  }

  return battles;
}
