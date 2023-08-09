import Login from '../login';

import './app.scss';

export default class App {
  private login = new Login();

  public start(): void {
    document.body.append(this.login.render());
  }
}
