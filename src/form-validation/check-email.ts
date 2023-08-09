export default function checkEmail(email: string): boolean {
  return /^[a-zA-Z0-9]+[a-zA-Z0-9._-]+@[a-zA-Z]+[a-zA-Z0-9._-]+\.[a-z]{2,}$/.test(email);
}
