import createElement from '../../dom-helper/create-element';
import { IPage } from '../../types/interfaces/page';
import './aboutus.scss';
import TeamMember from './teammember';

export class AboutUs implements IPage {
  private container: HTMLElement = createElement<HTMLDivElement>('div', {
    class: 'aboutus__container',
  });

  constructor() {
    this.init();
  }

  private init(): void {
    const aboutUsSection = createElement('section', { class: 'aboutus' });
    const members = TeamMember.getMembers();
    members.forEach((m) => aboutUsSection.append(m.render()));
    const aboutUsHeader = createElement('div', { class: 'aboutus__header' });
    aboutUsHeader.textContent = 'Our team';
    this.container.append(aboutUsHeader, aboutUsSection);
  }

  public render(): HTMLElement {
    return this.container;
  }
}
