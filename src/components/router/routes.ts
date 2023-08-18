import { IRoute } from '../../types/interfaces/route';
import { Home } from '../view/home/home';
import { NotFound } from '../view/pages/not-found';

export const routes: IRoute[] = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'not-found',
    component: NotFound,
  },
];
