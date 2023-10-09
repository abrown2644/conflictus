import { db } from '$lib/server/db';
import type { BatchType, Collection } from "mongodb";
import type Battle from "$lib/models/battle";


/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const collectionName = "conflicts";
    const collection: Collection = db.collection(collectionName);

    // const conflicts = await collection.find({}).project({ _id: 0, wikiid: 1, title: 1, year: 1, location: 1 }).toArray();

    return {
        // conflicts: conflicts
    };
}