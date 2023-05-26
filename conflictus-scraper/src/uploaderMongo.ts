import { MongoClient, Collection } from "mongodb";
import { Battle } from "./models/battle";
import fs from "fs";
require("dotenv").config();

// Battles
import battlesJSON from "./data/battles_List_of_naval_battles.json";

export default async function uploadMongoDb() {
  // MongoDB connection
  const connectionString = process.env.MONGODB_CONNECTION;
  const dbName = "Conflictus";
  const collectionName = "conflicts";

  const client = await MongoClient.connect(connectionString);
  const db = client.db(dbName);
  const collection: Collection = db.collection(collectionName);

  const battles: Battle[] = JSON.parse(JSON.stringify(battlesJSON));
  const total = battles.length;
  let uploadCount = 0;
  let errorBattles = [];

  for (const battle of battles) {
    try {
      // Find the battle if it exists
      const existingObject = await collection.findOne({ wikiid: battle.wikiid });

      if (!existingObject) {
        await collection.insertOne(battle).then(() => {
          uploadCount++;
          console.log(`[${uploadCount}/${total}] uploaded`);
        });
      } else {
        console.log(`${battle.title} already exists..skipping.`);
        errorBattles.push({ title: battle.title, wikiid: battle.wikiid, reason: "duplicate" });
      }
    } catch (error) {
      console.error("MongoDb Error:", error);
      errorBattles.push({ title: battle.title, wikiid: battle.wikiid, reason: "error" });
    }
  }

  client.close();

  // Write to error.json
  const json = JSON.stringify(errorBattles, null, 2);
  fs.writeFileSync(`./src/data/errors.json`, json, "utf-8");
}
