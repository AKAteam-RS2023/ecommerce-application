import Router from '../components/router/router';
import { routes } from '../components/router/routes';

export const appRouter = new Router(routes);
export default class App {
  private router = appRouter;

  public init(): void {
    console.log(this.router);
  }
}
