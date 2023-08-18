import { IRoute } from '../../types/interfaces/route';
import { Home } from '../view/home';

export const routes: IRoute[] = [
  {
    path: '',
    component: Home,
  },
];
