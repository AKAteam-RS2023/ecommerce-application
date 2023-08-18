import createElement from '../../dom-helper/create-elements';

export class NotFound {
  private containerPage?: HTMLDivElement;

  private pageHeader?: HTMLElement;

  private pageText?: HTMLDivElement;

  public render(): HTMLDivElement {
    this.containerPage = createElement<HTMLDivElement>('div', {
      class: 'not-found',
    });
    this.pageHeader = createElement<HTMLElement>('h1');
    this.pageHeader.innerText = 'Page not found';
    this.pageText = createElement<HTMLDivElement>('div', {
      class: 'page-text',
    });
    this.pageText.innerHTML = '<p>Please choose another page from the menu or go to the <a href="/">home page</a>.</p>';
    this.containerPage.append(this.pageHeader, this.pageText);
    return this.containerPage;
  }
}
