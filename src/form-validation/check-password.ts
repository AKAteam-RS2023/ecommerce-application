export default function checkPassword(password: string): void {
  if (password.trim() !== password) {
    throw Error("Password mustn't contain leading or trailing whitespace.");
  }
  if (!/[a-z]+/.test(password)) {
    throw Error('Password must contain at least one lowercase letter');
  }
  if (!/[A-Z]+/.test(password)) {
    throw Error('Password must contain at least one uppercase letter');
  }
  if (!/[0-9]+/.test(password)) {
    throw Error('Password must contain at least one digit');
  }
  if (!/[!@#$%^&*]+/.test(password)) {
    throw Error('Password must contain at least one special character');
  }
  if (password.length !== 8) {
    throw Error('Password must be at least 8 characters long');
  }
}