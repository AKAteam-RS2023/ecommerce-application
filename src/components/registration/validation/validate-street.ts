export default function validateStreet(street: string): void {
  if (street.length === 0) {
    throw new Error('This field is required');
  }
}
