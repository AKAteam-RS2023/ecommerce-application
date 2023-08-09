export default function checkPassword(password: string): boolean {
  return (
    password.length === 8
    && /[a-z]+/.test(password)
    && /[A-Z]+/.test(password)
    && /[0-9]+/.test(password)
    && /[!@#$%^&*]+/.test(password)
    && !/\s/g.test(password)
  );
}
