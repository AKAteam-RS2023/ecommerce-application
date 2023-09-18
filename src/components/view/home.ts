import createElement from '../../dom-helper/create-element';
import { IPage } from '../../types/interfaces/page';
import mainBackground from '../../assets/image/main-background.png';
import promoImg1 from '../../assets/image/promo1.png';
import promoImg2 from '../../assets/image/promo2.png';
import promoImg3 from '../../assets/image/promo3.png';

export class Home implements IPage {
  private mainPageWrapper: HTMLDivElement = createElement('div', { class: 'main__wrapper' });

  private promoSection: HTMLElement = createElement('section', { class: 'promo' });

  public render(): HTMLDivElement {
    this.mainPageWrapper.textContent = '';
    const mainHeaderWrapper: HTMLDivElement = createElement('div', { class: 'main-header__wrapper' });
    const mainHeaderTextBlock = createElement('div', { class: 'main-header__text-block' });
    const mainHeaderTitle = createElement('h1', { class: 'main-header__title' });
    mainHeaderTitle.innerHTML = 'Odkryj nasze nowe kolekcje';
    const mainHeaderText = createElement('div', { class: 'main-header__text' });
    mainHeaderText.textContent = 'Witaj na naszej stronie internetowej z najwyższej jakości meblami! Odkryj wyjątkową kolekcję mebli, które odmienią Twoje wnętrza. Znajdziesz u nas wszystko, czego potrzebujesz, by stworzyć idealne miejsce w swoim domu. Niezwłocznie zanurz się w świat elegancji i wygody, wybierając nasze meble. Jesteśmy tu, by pomóc Ci uczynić Twoje marzenia o pięknym wnętrzu rzeczywistością!';
    const mainHeaderLink = createElement('a', {
      class: 'main-header__link',
      href: '/catalog',
    });
    mainHeaderLink.textContent = 'KATALOG';
    mainHeaderTextBlock.append(mainHeaderTitle, mainHeaderText, mainHeaderLink);
    this.renderPromo();
    mainHeaderWrapper.append(mainHeaderTextBlock);
    mainHeaderWrapper.style.background = `url(${mainBackground})`;
    this.mainPageWrapper.append(mainHeaderWrapper, this.promoSection);
    return this.mainPageWrapper;
  }

  private renderPromo(): HTMLElement {
    this.promoSection.textContent = '';
    const promoTitle = createElement('h2', { class: 'promo__title' });
    promoTitle.textContent = 'PROMOCODE';
    const promoWrapper = createElement('h2', { class: 'promo__wrapper' });
    const promoItem1 = createElement('div', { class: 'promo__item' });
    promoItem1.style.background = `url(${promoImg1})`;
    const promoItemTextBlock1 = createElement('div', { class: 'promo__text-block' });
    promoItemTextBlock1.textContent = 'Kod promocyjny obowiązuje na wszystkie produkty w katalogu bez wyjątków. Rabat z kodu promocyjnego nie łączy się z innymi kodami promocyjnymi';
    const promoItemCode1 = createElement('div', { class: 'promo__code' });
    promoItemCode1.textContent = 'DISCOUNT-10';
    promoItemTextBlock1.append(promoItemCode1);
    promoItem1.append(promoItemTextBlock1);

    const promoItem2 = createElement('div', { class: 'promo__item' });
    promoItem2.style.background = `url(${promoImg2})`;
    const promoItemTextBlock2 = createElement('div', { class: 'promo__text-block' });
    promoItemTextBlock2.textContent = 'Kod promocyjny obowiązuje na wszystkie sofy. Rabat z kodu promocyjnego nie łączy się z innymi kodami promocyjnymi';
    const promoItemCode2 = createElement('div', { class: 'promo__code' });
    promoItemCode2.textContent = 'SOFY-5';
    promoItemTextBlock2.append(promoItemCode2);
    promoItem2.append(promoItemTextBlock2);

    const promoItem3 = createElement('div', { class: 'promo__item' });
    promoItem3.style.background = `url(${promoImg3})`;
    const promoItemTextBlock3 = createElement('div', { class: 'promo__text-block' });
    promoItemTextBlock3.textContent = 'Kod promocyjny obowiązuje na wszystkie łóżka. Rabat z kodu promocyjnego nie łączy się z innymi kodami promocyjnymi';
    const promoItemCode3 = createElement('div', { class: 'promo__code' });
    promoItemCode3.textContent = 'BED-3';
    promoItemTextBlock3.append(promoItemCode3);
    promoItem3.append(promoItemTextBlock3);
    promoWrapper.append(promoItem1, promoItem2, promoItem3);
    this.promoSection.append(promoTitle, promoWrapper);
    return this.promoSection;
  }
}
