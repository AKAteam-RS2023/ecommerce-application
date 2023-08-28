import ProductInfo from '../product-info';
import { Footer } from '../view/footer';
import { Header } from '../view/header';
import { MainSection } from '../view/main';
import { NotFound } from '../view/not-found';
import { routes } from './routes';

export default class UrlHandler {
  private notFoundPage?: NotFound;

  private main = new MainSection();

  private footer?: Footer;

  private header?: Header;

  private aboutProductPage?: ProductInfo;

  public urlChangedHandler(requestParams: { resource?: string; path?: string }): void {
    const pathForFind = requestParams.resource === '' ? requestParams.path : `${requestParams.path}/{id}`;
    const route = routes.find((item) => item.path === pathForFind);

    if (requestParams.path === 'catalog' && requestParams.resource) {
      const params = requestParams.resource.split('?');
      this.renderAboutProductPage(params[0], params[1]);
      return;
    }

    if (!route) {
      this.renderToNotFoundPage();
      return;
    }

    document.body.innerHTML = '';
    this.header = new Header();
    this.footer = new Footer();
    this.header.toggleActive();
    const component = new route.component();
    const mainSection = this.main.render();
    this.main.mainWrapper?.append(component.render());
    document.body.append(this.header?.render(), mainSection, this.footer?.render());
  }

  private renderAboutProductPage(id: string, variantID?: string): void {
    document.body.innerHTML = '';
    this.header = new Header();
    this.footer = new Footer();
    this.aboutProductPage = new ProductInfo(id, variantID);
    document.body.append(
      this.header.render(),
      this.aboutProductPage.render(),
      this.footer.render(),
    );
  }

  private renderToNotFoundPage(): void {
    document.body.innerHTML = '';
    this.header = new Header();
    this.footer = new Footer();
    this.notFoundPage = new NotFound();
    document.body.append(this.header?.render(), this.notFoundPage.render(), this.footer?.render());
  }
}
