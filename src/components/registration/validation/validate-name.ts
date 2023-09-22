export default function validateName(name: string): void {
  if (name.length === 0) {
    throw new Error('This field is required');
  }
  if (/^[a-zA-ZąĄęĘłŁóÓżŻźŹćĆśŚńŃ\s-]+$/.test(name)) {
    return;
  }
  throw new Error('This field cannot contain numbers and symbols');
}
