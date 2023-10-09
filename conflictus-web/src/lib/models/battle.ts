export default class Battle {
  wikiid!: number;
  title!: string;
  type!: string; // land, sea, air
  year!: number;
  date!: string;
  war!: string;
  description!: string;
  content!: string;
  location!: Location;
  url!: string;
  canonical_title!: string;
  image!: string;
}

type Location = {
  lat: number;
  lon: number;
  name: string;
};


