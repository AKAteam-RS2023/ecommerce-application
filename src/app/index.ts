import Login from '../components/login';

export default class App {
  private login = new Login();

  public init(): void {
    document.body.append(this.login.render());
  }
}
