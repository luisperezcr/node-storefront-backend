import { Product, ProductsStore } from '../models/products';

const store = new ProductsStore();
const product: Product = {
  name: 'Pasta',
  price: 15,
  category_id: 1
};

describe('Products Model', () => {
  it('should have index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have byCategory method', () => {
    expect(store.byCategory).toBeDefined();
  });

  it('should get products', async () => {
    const result = await store.index();
    expect(result).toEqual([]);
  });

  it('should create a product', async () => {
    const result = await store.create(product);
    expect(result?.name).toEqual(product.name);
  });

  it('should get product by ID', async () => {
    const result = await store.show(1);
    expect(result?.name).toEqual(product.name);
  });

  it('should get products by category', async () => {
    const result = await store.byCategory(1);
    expect(result[0].name).toEqual(product.name);
  });
});
