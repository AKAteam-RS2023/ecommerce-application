const MIN_LENGTH = 8;

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
    throw Error('Password must contain at least one of this !@#$%^&* characters');
  }
  if (password.length < MIN_LENGTH) {
    throw Error(`Password must be at least ${MIN_LENGTH} characters long`);
  }
}
