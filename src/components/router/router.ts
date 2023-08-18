import { IRoute } from '../../types/interfaces/route';

export default class Router {
  constructor(private routes: IRoute[]) {
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

  public navigate(url: unknown | null): void {
    if (typeof url === 'string') {
      Router.setHistory(url);
    }
    const urlString = window.location.pathname.slice(1);

    const result: { path?: string, resource?: string } = {};
    const path = urlString.split('/');
    [result.path = '', result.resource = ''] = path;

    this.urlChangedHandler(result);
  }

  private urlChangedHandler(requestParams: { resource?: string, path?: string }): void {
    const pathForFind = requestParams.resource === '' ? requestParams.path : `${requestParams.path}/{id}`;
    const route = this.routes.find((item) => item.path === pathForFind);

    if (!route) {
      this.redirectToNotFoundPage();
      return;
    }

    console.log(requestParams);
    const component = new route.component();
    document.body.innerHTML = '';
    document.body.appendChild(component.init());
    // route.callback(requestParams.resource);
  }

  private redirectToNotFoundPage(): void {
    const notFoundPage = this.routes.find((item) => item.path === 'not-found');
    if (notFoundPage) {
      this.navigate(notFoundPage.path);
    }
  }
}
