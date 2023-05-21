import { Battle } from "../../models/battle";
import parseText from "../parseText";
import parseYear from "../parseYear";
import parseUrl from "../parseUrl";

export async function layoutList(document: Document): Promise<Array<Battle>> {
  const h2Elements = document.querySelectorAll("h2");
  const liElements: HTMLLIElement[] = [];

  h2Elements.forEach((h2) => {
    let nextElement = h2.nextElementSibling;

    while (nextElement) {
      if (nextElement.tagName.toLowerCase() === "ul") {
        const lis = nextElement.querySelectorAll("li");
        lis.forEach((li) => {
          liElements.push(li);
        });
      }

      nextElement = nextElement.nextElementSibling;
    }
  });

  let battles: Battle[] = [];

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
