import createElement from '../../dom-helper/create-element';
import { IPage } from '../../types/interfaces/page';
import './aboutus.scss';
import TeamMember from './teammember';
import Principle1 from '../../assets/image/principle1.png';
import Principle2 from '../../assets/image/principle2.webp';
import Principle3 from '../../assets/image/principle3.png';
import Principle4 from '../../assets/image/principle4.png';
import Principle5 from '../../assets/image/principle5.png';
import Principle6 from '../../assets/image/principle6.png';

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
    aboutUsHeader.textContent = 'About us';
    const akaTeam = createElement('div', { class: 'aboutus__akateam' });
    akaTeam.innerHTML = `<span class="aboutus__akateam--furniro">Furniro.</span> single page application is a result of effective <span class="aboutus__akateam--collaboration">collaboration</span> of
    young frontend developers from <span class="aboutus__akateam--aka">AKA</span>Team`;
    this.container.append(aboutUsHeader, akaTeam, aboutUsSection);

    const collaboration = this.container.querySelector('.aboutus__akateam--collaboration');
    collaboration?.addEventListener('click', () => AboutUs.showDialog(AboutUs.createCollaboration()));
  }

  private static showDialog = (dialogContent: HTMLElement): void => {
    const modal = createElement('div', { class: 'aboutus__modal' });
    modal.style.display = 'block';
    const content = createElement('div', { class: 'aboutus__modal--content' });
    content.append(dialogContent);
    modal.append(content);
    document.body.appendChild(modal);
    modal.addEventListener('click', () => modal.remove());
  };

  private static createCollaboration(): HTMLElement {
    const content = createElement('div', { class: 'aboutus__collaboration' });
    const header = createElement('div', { class: 'aboutus__collaboration--header' });
    header.textContent = '6 principles of our successful collaboration';

    const items = createElement('div', { class: 'aboutus__collaboration--items' });

    const item1 = AboutUs.createCollaborationItem(Principle1, 'Effective planning in Jira');
    const item2 = AboutUs.createCollaborationItem(Principle2, 'Comunication on daily meetings');
    const item3 = AboutUs.createCollaborationItem(Principle3, 'Consultations with mentor');
    const item4 = AboutUs.createCollaborationItem(
      Principle4,
      'Working with Ecommerce tools documentation',
    );
    const item5 = AboutUs.createCollaborationItem(
      Principle5,
      'Fast communication on Discord channel',
    );
    const item6 = AboutUs.createCollaborationItem(Principle6, 'Retrospective analysis of sprints');

    items.append(item1, item2, item3, item4, item5, item6);
    content.append(header, items);

    return content;
  }

  private static createCollaborationItem(imageSrc: string, text: string): HTMLElement {
    const item = createElement('div', { class: 'aboutus__collaboration--item' });
    const itemImg = createElement<HTMLImageElement>('img', {
      class: 'aboutus__collaboration--image',
    });
    itemImg.src = imageSrc;
    item.append(itemImg);
    const itemDescr = createElement<HTMLImageElement>('div', {
      class: 'aboutus__collaboration--descr',
    });
    itemDescr.textContent = text;
    item.append(itemDescr);
    return item;
  }

  public render(): HTMLElement {
    return this.container;
  }
}
