import { IPage } from '../../types/interfaces/page';
import { Footer } from '../view/footer';
import { Header } from '../view/header';
import { MainSection } from '../view/main';
import { NotFound } from '../view/not-found';
import { routes } from './routes';

export default class UrlHandler {
  private notFoundPage?: NotFound;

  private main = new MainSection();

  private footer = new Footer();

  private header = new Header();

  private instances: Record<string, IPage> = {};

  private initMain(): void {
    document.body.append(this.header.render(), this.main.render(), this.footer.render());
  }

  constructor() {
    this.initMain();
  }

  public urlChangedHandler(requestParams: { resource?: string; path?: string }): void {
    // TODO (Alina): refactor for more flexible urls
    const pathForFind = requestParams.resource === ''
      ? requestParams.path
      : `${requestParams.path}/${requestParams.resource}`;
    const route = routes.find((item) => item.path === pathForFind);

    if (!route) {
      this.renderToNotFoundPage();
      return;
    }

    if (!(route.path in this.instances) || !route.isSingle) {
      this.instances[route.path] = new route.component();
    }
    this.header.toggleActive();
    this.main.mainWrapper.innerHTML = '';
    this.main.mainWrapper.append(this.instances[route.path].render());
  }

  private renderToNotFoundPage(): void {
    this.notFoundPage = new NotFound();
    this.main.mainWrapper.innerHTML = '';
    this.main.mainWrapper.append(this.notFoundPage.render());
  }
}
