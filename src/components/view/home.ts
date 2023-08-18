import App from '../../app';

export class Home {
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
