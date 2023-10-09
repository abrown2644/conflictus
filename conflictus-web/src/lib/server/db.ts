import { error } from "@sveltejs/kit";
import * as mongoDB from "mongodb";
import { MONGODB_CONNECTION } from '$env/static/private';

// console.log('env', MONGODB_CONNECTION);
const connectionString: string = MONGODB_CONNECTION;
const dbName = "Conflictus";

// const client = await MongoClient.connect(connectionString);
const client: mongoDB.MongoClient = new mongoDB.MongoClient(connectionString);

await client.connect();

export const db: mongoDB.Db = client.db(dbName);


