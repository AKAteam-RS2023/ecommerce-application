export default function validateEmail(email: string): void {
  if (!/^[a-zA-Z0-9]+[a-zA-Z0-9._-]+@[a-zA-Z]+[a-zA-Z0-9._-]+\.[a-z]{2,}$/.test(email)) {
    throw new Error('Email is not valid');
  }
}
