import { Battle } from "../../models/battle";
import parseText from "../parseText";
import parseYear from "../parseYear";
import parseUrl from "../parseUrl";

export async function layoutTableV5(document: Document): Promise<Array<Battle>> {
  const tables = document.querySelectorAll("table.wikitable");

  let battles: Battle[] = [];

  //Crawl Tables
  for (let i = 0; i < tables.length; i++) {
    const tableNumber = i;

    const rows = tables[i].querySelectorAll("tr");
    let lastYear: number | undefined;

    for (const [i, row] of [...rows].entries()) {
      if (i === 0) continue; // skip headers row

      const colCount: number = row.querySelectorAll("td").length;

      let battle = new Battle();

      // Top Table
      if (tableNumber === 0) {
        switch (colCount) {
          case 4:
            battle.year = lastYear;
            battle.title = parseText(row.children[0].textContent);
            battle.url = parseUrl(row.children[0]?.querySelector("a")?.getAttribute("href"));
            break;

          case 5:
            let yearText = row.children[0].textContent;
            if (yearText) battle.year = lastYear = parseYear(yearText);

            battle.title = parseText(row.children[1].textContent) || "no_title";
            battle.url = parseUrl(row.children[1]?.querySelector("a")?.getAttribute("href"));
            break;
        }
      }
      // Middle Table
      else if (tableNumber === 1) {
        switch (colCount) {
          case 3:
            let yearText = row.children[0].textContent;
            if (yearText) battle.year = lastYear = parseYear(yearText);

            battle.title = parseText(row.children[1].textContent) || "no_title";
            battle.url = parseUrl(row.children[1]?.querySelector("a")?.getAttribute("href"));
            battle.description = parseText(row.children[2].textContent);
            break;
        }
      }
      // Bottom Table
      else if (tableNumber === 2) {
        switch (colCount) {
          case 4:
            let yearText = row.children[0].textContent;
            if (yearText) battle.year = lastYear = parseYear(yearText);

            battle.date = parseText(row.children[1].textContent) || null;

            battle.title = parseText(row.children[2].textContent) || "no_title";
            battle.url = parseUrl(row.children[2]?.querySelector("a")?.getAttribute("href"));
            battle.description = parseText(row.children[3].textContent);
            break;
        }
      }

      battles.push(battle);
    }
  }

  return battles;
}
