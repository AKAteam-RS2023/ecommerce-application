export default function validatePassword(password: string): void {
  if (password === '' || password.length < 8) {
    throw new Error('Your password needs to be at least 8 characters');
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    throw new Error('Use at least 1 uppercase letter and 1 number');
  }
  if (!/[!@#$%^&*]+/.test(password)) {
    throw Error('Password must contain one of this !@#$%^&* characters');
  }
}
