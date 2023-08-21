import { Country } from '../country';

export default function validateCountry(country: string): void {
  if (country !== Country.Poland && country !== Country.Lithuania) {
    throw new Error(`We deliver only to ${Country.Poland} and ${Country.Lithuania}`);
  }
}
