import { IPage } from './page';

export interface IRoute<T extends IPage> {
  path: string;
  component: new () => T;
}
