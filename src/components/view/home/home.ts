import { appRouter } from '../../../app';

export class Home {
  public init(): HTMLButtonElement {
    console.log('home');
    const button = document.createElement('button');
    button.innerText = 'button';
    button.addEventListener('click', () => {
      console.log('click', this);
      appRouter.navigate('asdfgh');
    });
    return button;
  }
}
