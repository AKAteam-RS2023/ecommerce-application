import ProductSlider from './product-slider';
import IProductDetails from '../../types/interfaces/productDetails';

// Mock a sample product object for testing
const mockProduct: IProductDetails = {
  description: 'description',
  id: 'stringId',
  price: '100',
  name: 'Test Product',
  imagesUrl: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
};

describe('ProductSlider', () => {
  let productSlider: ProductSlider;

  beforeEach(() => {
    productSlider = new ProductSlider(mockProduct);
  });

  it('should render a product slider with images', () => {
    const productSliderElement = productSlider.render();
    expect(productSliderElement).toBeDefined();
    expect(productSliderElement.querySelectorAll('.product-slider__item').length).toBe(3);
  });

  it('should go to the next slide when next() is called', () => {
    productSlider.render();
    productSlider.next();
    expect(productSlider.index).toBe(1);
  });

  it('should go to the previous slide when prev() is called', () => {
    productSlider.render();
    productSlider.prev();
    expect(productSlider.index).toBe(2); // Assuming the initial index is 0
  });

  it('should go to the specified slide when goto() is called', () => {
    productSlider.render();
    productSlider.goto(productSlider.index + 1);
    expect(productSlider.index).toBe(1);
  });

  it('should go to the specified slide when goto() is called', () => {
    productSlider.render();
    productSlider.goto(productSlider.index - 1);
    expect(productSlider.index).toBe(2);
  });
});
