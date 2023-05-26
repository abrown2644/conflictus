import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, query, where, getDocs } from "firebase/firestore";
import { Battle } from "./models/battle";
import fs from "fs";

// Battles JSON
import battlesJSON from "./data/battles_List_of_battles_in_the_21st_century.json";

export default async function upload() {
  // Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyAzKlGpAZ59waTAtyv7i9ieCQrLvm_Y23Y",
    authDomain: "conflictus-34add.firebaseapp.com",
    databaseURL: "https://conflictus-34add-default-rtdb.firebaseio.com",
    projectId: "conflictus-34add",
    storageBucket: "conflictus-34add.appspot.com",
    messagingSenderId: "417272505347",
    appId: "1:417272505347:web:c604c6a8a6ac156e741a36",
    measurementId: "G-L569P9T68M",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  const battles: Battle[] = JSON.parse(JSON.stringify(battlesJSON));
  const total = battles.length;
  let uploadCount = 0;
  let errorBattles = [];

  for (const battle of battles) {
    // Add a new document
    const q = query(collection(db, "conflicts"), where("wikiid", "==", battle.wikiid));

    // Execute the query
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // console.log(`Uploading!...${battle.title}`);
      setDoc(doc(collection(db, "conflicts")), battle)
        .then(() => {
          uploadCount++;
          console.log(`[${uploadCount}/${total}] uploaded`);
        })
        .catch((error) => {
          errorBattles.push({ title: battle.title, wikiid: battle.wikiid, reason: "error" });
          console.error("Error writing document: ", error);
        });
    } else {
      console.log(`${battle.title} already exists..skipping.`);
      errorBattles.push({ title: battle.title, wikiid: battle.wikiid, reason: "duplicate" });
    }
  }

  // Write to error.json
  const json = JSON.stringify(errorBattles, null, 2);
  fs.writeFileSync(`./src/data/errors.json`, json, "utf-8");
}
