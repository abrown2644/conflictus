import { Battle } from "../../models/battle";
import parseText from "../parseText";
import parseYear from "../parseYear";
import parseUrl from "../parseUrl";

export async function layoutListV3(document: Document): Promise<Array<Battle>> {
  const deleteH21 = document.getElementById("1801–15").parentElement;
  const deleteUl1 = deleteH21.nextElementSibling;

  const deleteH22 = document.getElementById("1816–60").parentElement;
  const deleteUl2 = deleteH22.nextElementSibling;

  const deleteH23 = document.getElementById("1861").parentElement;
  const deleteUl3 = deleteH23.nextElementSibling;

  const deleteH24 = document.getElementById("1862").parentElement;
  const deleteUl4 = deleteH24.nextElementSibling.nextElementSibling;

  const title = "Battle of Kock's Plantation";
  const selector = `a[title='${title.replace("'", "\\'")}']`;
  const targetLi1 = document.querySelector(selector).parentElement.parentElement.parentElement;

  deleteH21.remove();
  deleteUl1.remove();

  deleteH22.remove();
  deleteUl2.remove();

  deleteH23.remove();
  deleteUl3.remove();

  deleteH24.remove();
  deleteUl4.remove();

  targetLi1.remove();

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
