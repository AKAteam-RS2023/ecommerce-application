import UrlHandler from './url-changed-handler';

export default class Router {
  private urlHandler = new UrlHandler();

  private hasUser?: boolean;

  public static instance: Router;

  public queryParams: { [key: string]: string } = {};

  constructor() {
    if (Router.instance) {
      throw new Error('Second instance');
    }

    document.addEventListener('DOMContentLoaded', () => {
      this.navigate(null);
    });
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target instanceof HTMLAnchorElement) {
        e.preventDefault();
        let url = target.href.split('/').pop();
        if (!url) {
          url = '';
        }
        Router.setHistory(url);
        this.navigate(null);
      }
    });
    window.addEventListener('popstate', this.navigate);
    Router.instance = this;
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

    this.queryParams = Object.fromEntries(new URLSearchParams(window.location.search.slice(1)));

    this.hasUser = !!localStorage.getItem('userToken');
    if ((result.path === 'login' || result.path === 'registration') && this.hasUser) {
      result.path = '';
      this.navigate(result.path);
    }

    this.urlHandler.urlChangedHandler(result);
  };
}
