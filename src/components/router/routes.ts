import { IPage } from '../../types/interfaces/page';
import { IRoute } from '../../types/interfaces/route';
import Catalog from '../catalog';
import Login from '../login';
import { Profile } from '../profile';
import Registration from '../registration';
import { Home } from '../view/home';
import ProductView from '../product/product';

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
    path: 'registration',
    component: Registration,
  },
  {
    path: 'catalog',
    component: Catalog,
  },
  {
    path: 'profile',
    component: Profile,
  },
  {
    path: 'catalog/product',
    component: ProductView,
  },
];
