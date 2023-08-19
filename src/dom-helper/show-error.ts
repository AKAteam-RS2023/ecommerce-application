import createElement from './create-element';

export default class ShowError {
  private container: HTMLElement;

  constructor(public classNames: string) {
    this.container = createElement('div', { class: classNames });
    this.container.style.display = 'none';
    document.body.append(this.container);
  }

  public show(message: string, { right, bottom }: Record<string, number>): void {
    this.container.textContent = message;
    this.container.style.display = 'block';
    this.container.style.right = `calc(100vw - ${right}px)`;
    this.container.style.top = `${bottom + 1}px`;
  }

  public hide(): void {
    this.container.textContent = '';
    this.container.style.display = 'none';
  }
}
