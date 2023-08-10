import './app.scss';

import Registration from '../components/registration';

export default class App {
  private registration = new Registration();

  public init(): void {
    document.body.append(this.registration.render());
  }
}
