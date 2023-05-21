export class Battle {
  id: number = null;
  title: string = null;
  type: string = null; // land, sea, air
  year: number = null;
  date: string = null;
  war: string = null;
  description: string = null;
  content: string = null;
  location: Location;
  url: string = null;
  canonical_title: string = null;
  image: string = null;
}

type Location = {
  lat: number;
  lon: number;
  name: string;
};
