import createElement from '../../dom-helper/create-element';
import { IPage } from '../../types/interfaces/page';
import notFoundImg from '../../assets/image/404-page-not-found.png';
import '../../styles/pages/not-found.scss';

export class NotFound implements IPage {
  private containerPage?: HTMLDivElement;

  private pageHeader?: HTMLElement;

  private pageText?: HTMLDivElement;

  public render(): HTMLDivElement {
    this.containerPage = createElement<HTMLDivElement>('div', {
      class: 'not-found',
    });
    const pageImage = createElement<HTMLImageElement>('img', {
      class: 'not-found-img',
    });
    pageImage.src = notFoundImg;
    pageImage.alt = 'Page not found';
    this.pageHeader = createElement<HTMLElement>('h1');
    this.pageHeader.innerText = 'Page not found';
    this.pageText = createElement<HTMLDivElement>('div', {
      class: 'page-text',
    });
    this.pageText.innerHTML = '<p>Please choose another page from the menu or go to the <a href="/">home page</a>.</p>';
    this.containerPage.append(pageImage, this.pageHeader, this.pageText);
    return this.containerPage;
  }
}
