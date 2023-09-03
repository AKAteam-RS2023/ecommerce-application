import createElement from '../../dom-helper/create-element';
import eventEmitter from '../../dom-helper/event-emitter';

import Crumb from '../crumb';

import { getCategoryById } from '../../services/ecommerce-api';

import './breadcrumb.scss';

const LANGUAGE = 'pl-PL';

class BreadCrumb {
  private container = createElement('div', { class: 'breadcrumb' });

  private firstCrumb = createElement('div', { class: 'crumb' });

  private selectCategory: string | null = null;

  constructor() {
    this.initFirstCrumb();
    this.init();
    eventEmitter.subscribe('event: change-category', (data) => this.changeCategory(data));
  }

  private changeCategory = (data?: Record<string, string>): void => {
    if (!data || !('id' in data)) {
      return;
    }
    if (this.selectCategory && data.id === this.selectCategory) {
      return;
    }
    this.container.innerHTML = '';
    this.selectCategory = data.id;
    this.container.append(this.firstCrumb);
    if ('parentId' in data) {
      getCategoryById(data.parentId)
        .then((res) => {
          const crumb = new Crumb({ id: data.parentId, name: res.name[LANGUAGE] });
          this.container.append(crumb.render());
        })
        .then(() => {
          getCategoryById(data.id).then((subcategory) => {
            const crumb = new Crumb({
              id: data.id,
              parentId: data.parentId,
              name: subcategory.name[LANGUAGE],
            });
            this.container.append(crumb.render());
          });
        });
    } else {
      getCategoryById(data.id).then((subcategory) => {
        const crumb = new Crumb({ id: data.id, name: subcategory.name[LANGUAGE] });
        this.container.append(crumb.render());
      });
    }
  };

  private initFirstCrumb(): void {
    this.firstCrumb.textContent = 'Towary> ';
    this.firstCrumb.onclick = (): void => {
      this.init();
      eventEmitter.emit('event: show-all-products', undefined);
    };
  }

  private init(): void {
    this.selectCategory = null;
    this.container.innerHTML = '';
    this.container.append(this.firstCrumb);
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default new BreadCrumb();
