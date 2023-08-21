import createElement from './create-element';

export default class ShowError {
  private container: HTMLElement;

  public isError: boolean;

  constructor(
    public classNames: string,
    required: boolean,
  ) {
    this.container = createElement('div', { class: classNames });
    this.container.style.display = 'none';
    this.isError = required;
  }

  public render(): HTMLElement {
    return this.container;
  }

  public show(message: string): void {
    this.isError = true;
    this.container.textContent = message;
    this.container.style.display = 'block';
  }

  public hide(): void {
    this.isError = false;
    this.container.textContent = '';
    this.container.style.display = 'none';
  }
}
