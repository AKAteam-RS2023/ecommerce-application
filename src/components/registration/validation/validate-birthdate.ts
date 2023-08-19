export default function validateBirthdate(birthdate: string): void {
  const date = new Date(birthdate);
  const curDate = new Date();
  const minAllowedAge = 13;
  const maxAllowedAge = 120;
  const curAge = curDate.getFullYear() - date.getFullYear();
  if (curAge < minAllowedAge) {
    throw new Error(
      `You must be at least ${minAllowedAge} years old. Please, try again in ${
        minAllowedAge - curAge
      } year(s)`,
    );
  }
  if (curAge > maxAllowedAge || birthdate === '') {
    throw new Error('Please set valid birthdate');
  }
}
