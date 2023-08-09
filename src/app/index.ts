import Login from '../components/login';

import './app.scss';

export default class App {
  private login = new Login();

  public init(): void {
    document.body.append(this.login.render());
  }
}
