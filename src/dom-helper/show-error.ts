import createElement from './create-element';

export default class ShowError {
  private container: HTMLElement;

  constructor(public classNames: string) {
    this.container = createElement('div', { class: classNames });
    this.container.style.display = 'none';
    document.body.append(this.container);
  }

  public show(message: string, { left, top }: Record<string, number>): void {
    this.container.textContent = message;
    this.container.style.display = 'block';
    this.container.style.left = `${left - 30}px`;
    this.container.style.top = `${top + 27}px`;
  }

  public hide(): void {
    this.container.textContent = '';
    this.container.style.display = 'none';
  }
}
