import { Battle } from "../../models/battle";
import parseText from "../parseText";
import parseYear from "../parseYear";
import parseUrl from "../parseUrl";

export async function layoutListV4(document: Document): Promise<Array<Battle>> {
  const theYear = 1863;
  let battles: Battle[] = [];

  const singleH2 = document.querySelector('a[title="Battle of Coștangalia"]');

  if (singleH2) {
    let battle = new Battle();

    battle.year = theYear;
    battle.title = parseText(singleH2.getAttribute("title"));
    battle.url = parseUrl(singleH2.getAttribute("href"));
    battles.push(battle);
  }

  const liElements = singleH2.nextElementSibling.querySelectorAll("li");

  //Crawl list
  for (const li of liElements) {
    //get year from above each list
    const yearNodeText = getTextNodeValue(li);
    const rows = li.querySelector("ul")?.querySelectorAll("li") || null;
    if (!rows) continue; // no lis then skip

    let lastYear: number | undefined;
    let lastDate: string | undefined;

    for (const [i, row] of [...rows].entries()) {
      let battle = new Battle();

      battle.title = parseText(row.querySelector("a")?.getAttribute("title"));
      battle.url = parseUrl(row.querySelector("a")?.getAttribute("href"));

      if (yearNodeText) {
        battle.year = parseYear(yearNodeText);
      }

      battle.description = null;

      battles.push(battle);
    }
  }

  return battles;
}

function getTextNodeValue(element: Element | null): string {
  if (!element) return "";

  const textNodes = Array.from(element.childNodes).filter((node) => node.nodeType === /* Node.TEXT_NODE */ 3);
  return textNodes.map((node) => node.textContent?.trim() ?? "").join(" ");
}
