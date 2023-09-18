import createElement from '../../dom-helper/create-element';
import KatyaImg from '../../assets/image/katya.jpg';
import AlinaImg from '../../assets/image/alina.jpg';
import photoAlena from '../../assets/image/photo_Alena.jpg';

export default class TeamMember {
  private contentElement: HTMLElement = createElement('div', {
    class: 'teammember__content teammember__content_active',
  });

  public name: string;

  public role: HTMLElement;

  public bio: string;

  public photo: string;

  public github: string;

  constructor(name: string, role: HTMLElement, bio: string, photo: string, github: string) {
    this.name = name;
    this.role = role;
    this.bio = bio;
    this.photo = photo;
    this.github = github;
    const backLink = this.role.querySelector('.teammember__link') as HTMLAnchorElement;
    backLink?.addEventListener('click', (e: MouseEvent) => this.hideDetails(e));
  }

  public render(): HTMLElement {
    const container = createElement('div', { class: 'teammember' });
    const wrapper = createElement('div', { class: 'teammember__wrapper' });
    wrapper.append(this.createInfo());
    wrapper.append(this.role);
    container.append(wrapper);
    return container;
  }

  private createInfo(): HTMLElement {
    const photo = createElement<HTMLImageElement>('img', {
      class: 'teammember__photo',
      src: this.photo,
      alt: this.name,
    });
    const nameContainer = createElement('div', { class: 'teammember__container' });
    const name = createElement<HTMLAnchorElement>('a', { class: 'teammember__container--name' });
    name.innerHTML = `<span>${this.name}</span>`;
    name.target = '_blank';
    name.href = this.github;
    const a = createElement<HTMLAnchorElement>('a', { class: 'teammember__container--github' });
    a.innerHTML = TeamMember.githubSvg;
    a.target = '_blank';
    a.href = this.github;
    nameContainer.append(name, a);
    const bio = createElement('div', { class: 'teammember__bio' });
    bio.textContent = this.bio;
    const detailsLink = createElement<HTMLAnchorElement>('a', { class: 'teammember__link' });
    detailsLink.textContent = 'ROLE';
    detailsLink.addEventListener('click', (e: MouseEvent) => this.showDetails(e));
    this.contentElement.append(photo, nameContainer, bio, detailsLink);
    return this.contentElement;
  }

  private showDetails = (e: MouseEvent): void => {
    e.stopPropagation();
    this.contentElement.classList.remove('teammember__content_active');
    this.role.classList.add('teammember__list_active');
  };

  private hideDetails = (e: MouseEvent): void => {
    e.stopPropagation();
    this.contentElement.classList.add('teammember__content_active');
    this.role.classList.remove('teammember__list_active');
  };

  public static getMembers(): TeamMember[] {
    const katya = new TeamMember(
      'Katya',
      TeamMember.createKatyaRole(),
      TeamMember.katyaBio,
      KatyaImg,
      'https://github.com/ShEP-JS',
    );
    const alina = new TeamMember(
      'Alina',
      TeamMember.createAlinaRole(),
      TeamMember.alinaBio,
      AlinaImg,
      'https://github.com/AlinaTsydzik',
    );

    const alena = new TeamMember(
      'Alena',
      TeamMember.createAlenaRole(),
      TeamMember.alenaBio,
      photoAlena,
      'https://github.com/alenzija',
    );

    return [alina, katya, alena];
  }

  private static createKatyaRole(): HTMLElement {
    const list = createElement<HTMLUListElement>('ul', { class: 'role__list' });
    const li1 = createElement<HTMLLIElement>('li');
    li1.textContent = 'user registration form';
    const li2 = createElement<HTMLLIElement>('li');
    li2.textContent = 'user profile page';
    const li3 = createElement<HTMLLIElement>('li');
    li3.textContent = 'products search';
    const li4 = createElement<HTMLLIElement>('li');
    li4.textContent = 'about us page';
    const li5 = createElement<HTMLLIElement>('li');
    li5.textContent = 'tried to be positive in any situation';
    list.append(li1, li2, li3, li4, li5);
    return TeamMember.createBaseRole(list, 'Katya');
  }

  private static createAlinaRole(): HTMLElement {
    const list = createElement<HTMLUListElement>('ul', { class: 'role__list' });
    const li1 = createElement<HTMLLIElement>('li');
    li1.textContent = 'routing';
    const li2 = createElement<HTMLLIElement>('li');
    li2.textContent = 'catalog content management';
    const li3 = createElement<HTMLLIElement>('li');
    li3.textContent = 'product page with slider';
    const li4 = createElement<HTMLLIElement>('li');
    li4.textContent = 'lazy loading in catalog';
    const li5 = createElement<HTMLLIElement>('li');
    li5.textContent = 'configuring and maintaining Jira';
    const li6 = createElement<HTMLLIElement>('li');
    li6.textContent = 'cheerful team lead';

    list.append(li1, li2, li3, li4, li5, li6);
    return TeamMember.createBaseRole(list, 'Alina');
  }

  private static createAlenaRole(): HTMLElement {
    const list = createElement<HTMLUListElement>('ul', { class: 'role__list' });
    const li1 = createElement<HTMLLIElement>('li');
    li1.textContent = 'Login form';
    const li2 = createElement<HTMLLIElement>('li');
    li2.textContent = 'Catalog(Display Product List, Product Filtering and Sorting, Category Navigation)';
    const li3 = createElement<HTMLLIElement>('li');
    li3.textContent = 'Cart(Integrate the Catalog Product page with the commercetools API, Add or Remove Product from Cart, Display Basket Items, Modify Product Quantity, Recalculate Total Cost)';
    list.append(li1, li2, li3);
    return TeamMember.createBaseRole(list, 'Alena');
  }

  private static createBaseRole(list: HTMLUListElement, name: string): HTMLElement {
    const role = createElement('div', { class: 'teammember__list' });
    const header = createElement('div', { class: 'teammember__list-header' });
    header.innerHTML = `<span>${name}</span> implemented the following features`;
    const a = createElement<HTMLAnchorElement>('a', { class: 'teammember__link' });
    a.textContent = 'BACK';
    role.append(header, list, a);
    return role;
  }

  private static katyaBio = `Katya is a creative and self-starting Front-End Developer from Bialystok (Poland) building websites and apps, highly skilled in HTML/CSS/JS/TS 
seeking an entry-level position to use her skills in frontend.`;

  private static alinaBio = 'Alina is a novice front-end developer with years of experience in other IT fields, including SEO, web analytics, and website development. Currently, she dedicates all her time to learning HTML/CSS/JS/TS. The next step is to learn Angular.';

  private static alenaBio = `I'm a junior software developer. I'm interested in FE. I'm improving my skills by Udemy courses and resolving tasks at codewars platform.
  My strong skills are problem solving, I'm a quick learner and a result-oriented person. I can work independently as well as in a team.`;

  private static githubSvg = `<svg viewBox="64 64 896 896" focusable="false" 
  data-icon="github" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0138.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"></path></svg>`;
}
