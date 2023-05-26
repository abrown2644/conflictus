import axios, { AxiosError } from "axios";
import { JSDOM } from "jsdom";
import { Battle } from "./models/battle";
import { WikiPaths } from "./paths";
import { layoutTable } from "./helpers/layouts/layoutTable";
import { layoutTableV2 } from "./helpers/layouts/layoutTableV2";
import { layoutTableV3 } from "./helpers/layouts/layoutTableV3";
import { layoutTableV4 } from "./helpers/layouts/layoutTableV4";
import { layoutTableV5 } from "./helpers/layouts/layoutTableV5";
import { layoutList } from "./helpers/layouts/layoutList";
import { layoutListV2 } from "./helpers/layouts/layoutListV2";
import { layoutListV3 } from "./helpers/layouts/layoutListV3";
import { layoutListV4 } from "./helpers/layouts/layoutListV4";
import fs from "fs";

export default async function crawl() {
  const allBattles: Battle[] = [];

  for (const path of WikiPaths) {
    const url = "https://en.wikipedia.org/wiki/" + path.url;

    const HTMLData = axios
      .get(url)
      .then((res) => res.data)
      .catch((error: AxiosError) => {
        console.error(error.message);
      });

    const dom = new JSDOM(await HTMLData);
    const document = dom.window.document;

    let battles: Battle[] = [];

    // Select a Layout
    switch (path.layout) {
      case "table":
        battles = await layoutTable(document);
        break;

      case "table v2":
        battles = await layoutTableV2(document);
        break;

      case "table v3":
        battles = await layoutTableV3(document);
        break;

      case "table v4":
        battles = await layoutTableV4(document);
        break;

      case "table v5":
        battles = await layoutTableV5(document);
        break;

      case "list":
        battles = await layoutList(document);
        break;

      case "list v2":
        battles = await layoutListV2(document);
        break;

      case "list v3":
        battles = await layoutListV3(document);
        break;

      case "list v4":
        battles = await layoutListV3(document);
        break;
    }

    // continue crawling data for battles
    for (const battle of battles) {
      if (battle.url === null) continue;

      // if (battle.year < 1862) continue;

      // if (battle.year < 1900) continue;
      if (battle.year === 1864) break;

      // API
      let battlePaths = battle.url.split("/");
      let apiPath = battlePaths[battlePaths.length - 1];
      const apiResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${apiPath}`);
      const apiJson = await apiResponse.json();

      // ID - API
      if (apiJson.hasOwnProperty("pageid")) {
        battle.wikiid = apiJson.pageid;
      }

      // Location - API
      if (apiJson.hasOwnProperty("coordinates")) {
        battle.location = {
          name: null,
          lat: apiJson.coordinates.lat,
          lon: apiJson.coordinates.lon,
        };
      }

      // Description - API
      if (apiJson.hasOwnProperty("description")) {
        if (!battle.description || battle.description.length < 1) {
          battle.description = apiJson.description;
        }
      }

      // Image - API
      if (apiJson.hasOwnProperty("originalimage")) {
        battle.image = apiJson.originalimage.source; //8==D <3
      }

      // Get Article page for rest of content
      const ArticleHTML = await axios
        .get(`https://en.wikipedia.org/${battle.url}`)
        .then((res) => res.data)
        .catch((error: AxiosError) => {
          console.error(error.message);
        });

      const article_dom = new JSDOM(await ArticleHTML);
      const article_document = article_dom.window.document;

      // Content
      let contentArray = [];
      const paragraphs = article_document.querySelector("#mw-content-text").querySelectorAll("p");
      for (const p of paragraphs) {
        contentArray.push(`<p>${p.innerHTML}</p>`);
      }

      battle.content = contentArray.join(" ");

      // Get Infobox
      const infobox = article_document.querySelector(".infobox");

      if (infobox) {
        // Date text
        if (battle.date === null) {
          const dateElement = Array.from(infobox.querySelectorAll("th")).find(
            (element) => element.textContent.trim() === "Date"
          );
          if (dateElement) battle.date = dateElement.nextElementSibling.textContent;
        }

        // War - WIP
        // const war = infobox.querySelectorAll("tr")[1].textContent;
        // if (war && war.length < 100) battle.war = war;
      }

      // Done!
      if (!allBattles.some((obj) => obj["wikiid"] === battle.wikiid)) {
        allBattles.push(battle); // if id not already in array puush
        console.log(battle.title);
      }
    }

    // Write to JSON
    const json = JSON.stringify(allBattles, null, 2);
    fs.writeFileSync(`./src/data/battles_${path.url}_page8-2.json`, json, "utf-8");
  }
}
