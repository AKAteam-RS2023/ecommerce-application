import Router from '../components/router/router';

export default class App {
  public static appRouter?: Router;

  public static init(): void {
    App.appRouter = new Router();
  }
}
