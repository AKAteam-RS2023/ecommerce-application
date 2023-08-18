export class ElementValidator {
  private element: HTMLInputElement;

  private validateFunc: (value: string) => void;

  private errorElement: HTMLElement;

  private enabledFunc?: () => boolean;

  constructor(
    element: HTMLInputElement,
    errorElement: HTMLElement,
    validateFunc: (value: string) => void,
    enabledFunc?: () => boolean,
  ) {
    this.element = element;
    this.errorElement = errorElement;
    this.validateFunc = validateFunc;
    this.enabledFunc = enabledFunc;
    this.errorElement.classList.add('registration__error');
    this.element.addEventListener('focusout', () => this.validate());
    this.element.addEventListener('input', () => this.validate());
  }

  public validate(): boolean {
    if (this.enabledFunc && !this.enabledFunc()) {
      this.hideError();
      return true;
    }

    try {
      this.validateFunc(this.element.value);
      this.hideError();
      return true;
    } catch (err) {
      if (!(err instanceof Error)) {
        return false;
      }
      this.errorElement.classList.add('registration__error--active');
      this.errorElement.textContent = err.message;
      return false;
    }
  }

  private hideError(): void {
    this.errorElement.classList.remove('registration__error--active');
  }
}
