import { IPage } from '../../types/interfaces/page';
import { IRoute } from '../../types/interfaces/route';
import Login from '../login';
import Registration from '../registration';
import { Home } from '../view/home';

export const routes: IRoute<IPage>[] = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Registration,
  },
];
