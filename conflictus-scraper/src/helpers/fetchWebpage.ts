import axios, { AxiosError } from "axios";
import { JSDOM } from "jsdom";

export default async function fetchWebpage(url: string): Promise<Document> {
  try {
    const response = await axios.get(url);
    const webpageContent = response.data;
    const dom = new JSDOM(await webpageContent);
    return dom.window.document;
  } catch (error) {
    console.error("Error fetching webpage:", error);
  }
}
