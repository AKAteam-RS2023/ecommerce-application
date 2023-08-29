import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';
import { getCategoryById } from '../../services/ecommerce-api';

import './breadcrumb.scss';

const LANGUAGE = 'pl-PL';

export default class BreadCrumb {
  private container = createElement('div', { class: 'breadcrumb' });

  private firstCrumb = createElement('a', { href: '#!', class: 'breadcrumb__item' });

  constructor() {
    this.init();
    eventEmitter.subscribe('event: change-category', (data) => {
      if (!data || !('id' in data)) {
        return;
      }
      this.container.innerHTML = '';
      this.container.append(this.firstCrumb);
      if ('parentId' in data) {
        getCategoryById(data.parentId)
          .then((res) => {
            const crumb = createElement('a', { href: '#!', class: 'breadcrumb__item' });
            crumb.textContent = `${res.name[LANGUAGE]}> `;
            this.container.append(crumb);
          })
          .then(() => {
            getCategoryById(data.id).then((subcategory) => {
              const crumb = createElement('a', { href: '#!', class: 'breadcrumb__item' });
              crumb.textContent = subcategory.name[LANGUAGE];
              this.container.append(crumb);
            });
          });
      } else {
        getCategoryById(data.id).then((subcategory) => {
          const crumb = createElement('a', { href: '#!', class: 'breadcrumb__item' });
          crumb.textContent = `${subcategory.name[LANGUAGE]}> `;
          this.container.append(crumb);
        });
      }
    });
  }

  private init(): void {
    this.firstCrumb.textContent = 'All products> ';
    this.container.append(this.firstCrumb);
  }

  public render(): HTMLElement {
    return this.container;
  }
}
