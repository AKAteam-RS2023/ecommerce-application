import './style.scss';

import svg from './assets/image/rs_school_js.svg';

const img = document.createElement('img');

img.src = svg;

document.body.append(img);

export const sum = (a: number, b: number): number => a + b;
