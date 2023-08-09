export default function checkEmail(email: string): void {
  if (
    !(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+/.test(email)
      && /[a-zA-Z]\.[a-zA-Z]/g.test(email)
      && !/^\./.test(email)
    )
  ) {
    throw Error('Email address must be properly formatted (e.g., user@example.com)');
  }
  if (email.trim() !== email) {
    throw Error('Email address must not contain leading or trailing whitespace');
  }
  if (!/\.[a-z]{2,}$/.test(email)) {
    throw Error('Email address must contain a domain name (e.g., example.com)');
  }
}
