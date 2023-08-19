import App from '../../app';
import { IPage } from '../../types/interfaces/page';

export class Home implements IPage {
  public render(): HTMLButtonElement {
    const button = document.createElement('button');
    button.innerText = 'button';
    button.addEventListener('click', () => {
      console.log('click', this);
      App.appRouter?.navigate('jkhvg');
    });
    return button;
  }
}
