import { appRouter } from '../../../app';

export class NotFound {
  public init(): HTMLDivElement {
    const container = document.createElement('div');
    const text = document.createElement('div');
    text.innerHTML = '<h2>Page not foud</h2>';
    const button = document.createElement('button');
    button.innerText = 'main';
    button.addEventListener('click', () => {
      console.log('click', this);
      appRouter.navigate('');
    });
    container.append(text, button);
    return container;
  }
}
