export class ElementValidator {
  private element: HTMLInputElement;

  private validateFunc: (value: string) => void;

  private errorElement: HTMLElement;

  constructor(
    element: HTMLInputElement,
    errorElement: HTMLElement,
    validateFunc: (value: string) => void,
  ) {
    this.element = element;
    this.errorElement = errorElement;
    this.validateFunc = validateFunc;
    this.errorElement.classList.add('registration__error');
    this.element.addEventListener('focusout', () => this.validate());
  }

  public validate(): void {
    try {
      this.validateFunc(this.element.value);
      this.errorElement.classList.remove('registration__error--active');
    } catch (err) {
      if (!(err instanceof Error)) {
        return;
      }
      this.errorElement.classList.add('registration__error--active');
      this.errorElement.textContent = err.message;
    }
  }
}
