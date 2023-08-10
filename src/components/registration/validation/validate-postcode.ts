export function validatePostcode(postcode: string): void {
  if (!/^[0-9]{2}-[0-9]{3}$/.test(postcode)) {
    throw new Error('Please enter valid post code');
  }
}
