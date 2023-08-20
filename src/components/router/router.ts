import { Footer } from '../view/footer';
import { NotFound } from '../view/not-found';
import { routes } from './routes';

export default class Router {
  private notFoundPage?: NotFound;

  private footer = new Footer();

  constructor() {
    document.addEventListener('DOMContentLoaded', () => {
      this.navigate(null);
    });
    window.addEventListener('popstate', this.navigate);
  }

  private disable(): void {
    window.removeEventListener('popstate', this.navigate);
  }

  private static setHistory(url: string): void {
    window.history.pushState(null, '', `/${url}`);
  }

  public navigate = (url: unknown | null): void => {
    if (typeof url === 'string') {
      Router.setHistory(url);
    }
    const urlString = window.location.pathname.slice(1);

    const result: { path?: string; resource?: string } = {};
    const path = urlString.split('/');
    [result.path = '', result.resource = ''] = path;

    this.urlChangedHandler(result);
  };

  private urlChangedHandler(requestParams: { resource?: string; path?: string }): void {
    const pathForFind = requestParams.resource === '' ? requestParams.path : `${requestParams.path}/{id}`;
    const route = routes.find((item) => item.path === pathForFind);

    if (!route) {
      this.renderToNotFoundPage();
      return;
    }

    document.body.innerHTML = '';
    const component = new route.component();
    document.body.append(component.render(), this.footer.render());
    // route.callback(requestParams.resource);
  }

  private renderToNotFoundPage(): void {
    this.notFoundPage = new NotFound();
    document.body.innerHTML = '';
    document.body.appendChild(this.notFoundPage.render());
  }
}
