export default function validateCountry(country: string): void {
  if (country !== 'Poland') {
    throw new Error('Unfortunately we deliver only to Poland');
  }
}
