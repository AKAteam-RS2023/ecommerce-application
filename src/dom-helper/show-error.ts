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
    document.body.append(this.container);
  }

  public show(message: string, { right, bottom }: Record<string, number>): void {
    this.isError = true;
    this.container.textContent = message;
    this.container.style.display = 'block';
    this.container.style.right = `calc(100vw - ${right}px)`;
    this.container.style.top = `${bottom + 1}px`;
  }

  public hide(): void {
    this.isError = false;
    this.container.textContent = '';
    this.container.style.display = 'none';
  }
}
