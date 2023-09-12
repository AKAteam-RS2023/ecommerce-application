import createElement from '../../dom-helper/create-element';
import KatyaImg from '../../assets/image/katya.jpg';

export default class TeamMember {
  public name: string;

  public role: string;

  public bio: string;

  public photo: string;

  public github: string;

  constructor(name: string, role: string, bio: string, photo: string, github: string) {
    this.name = name;
    this.role = role;
    this.bio = bio;
    this.photo = photo;
    this.github = github;
  }

  public render(): HTMLElement {
    const container = createElement('article', { class: 'teammember' });
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
    container.append(photo, nameContainer, bio);
    return container;
  }

  public static getMembers(): TeamMember[] {
    const katya = new TeamMember(
      'Katya',
      'developer',
      TeamMember.katyaBio,
      KatyaImg,
      'https://github.com/ShEP-JS',
    );
    const alina = new TeamMember(
      'Alina',
      'developer',
      TeamMember.alinaBio,
      '',
      'https://github.com/AlinaTsydzik',
    );
    const alena = new TeamMember(
      'Alena',
      'developer',
      TeamMember.alenaBio,
      '',
      'https://github.com/alenzija',
    );

    return [alina, alena, katya];
  }

  private static katyaBio = `Katya is a creative and self-starting Front-End Developer building websites and apps, highly skilled in HTML/CSS/JavaScript/TypeScript 
seeking an entry-level position to use her skills in frontend.`;

  private static alinaBio = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

  private static alenaBio = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

  private static githubSvg = `<svg viewBox="64 64 896 896" focusable="false" 
  data-icon="github" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0138.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"></path></svg>`;
}
