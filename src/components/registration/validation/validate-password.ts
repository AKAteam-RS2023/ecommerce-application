export default function validatePassword(password: string): void {
  if (password === '' || password.length < 8) {
    throw new Error('Your password needs to be at least 8 characters');
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    throw new Error(
      'Your password needs to have  1 uppercase letter, 1 lowercase letter, and 1 number',
    );
  }
}
