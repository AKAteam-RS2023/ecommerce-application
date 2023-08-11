export function validatePostcodePoland(postcode: string): void {
  if (!/^[0-9]{2}-[0-9]{3}$/.test(postcode)) {
    throw new Error('Please enter valid post code');
  }
}

export function validatePostcodeLithuania(postcode: string): void {
  if (!/^[0-9]{5}$/.test(postcode)) {
    throw new Error('Please enter valid post code');
  }
}

export function validatePostcodeVilnus(postcode: string): void {
  if (!/^[0-9]{6}$/.test(postcode)) {
    throw new Error('Please enter valid post code');
  }
}
