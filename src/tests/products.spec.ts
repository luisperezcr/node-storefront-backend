import { Product, ProductsStore } from '../models/products';
import supertest from 'supertest';
import app from '../server';

const request = supertest(app);
let testUser: { text: string };
const store = new ProductsStore();
const product: Product = {
  name: 'Pasta',
  price: 15,
  category_id: 1
};

describe('Products Model', () => {
  beforeAll(async () => {
    testUser = await request.post('/users').send({
      username: 'test-user-3',
      firstName: 'John',
      lastName: 'Doe',
      password: 'im-john-doe'
    });
  });

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
    expect(result.length).toBeGreaterThan(0);
  });

  it('should create a product', async () => {
    const result = await store.create(product);
    expect(result?.name).toEqual(product.name);
  });

  it('should get product by ID', async () => {
    const result = await store.show(2);
    expect(result?.name).toEqual(product.name);
  });

  it('should get products by category', async () => {
    const result = await store.byCategory(1);
    expect(result[1].name).toEqual(product.name);
  });

  it('should get products from endpoint', async () => {
    const response = await request.get('/products');
    const result = JSON.parse(response.text);
    expect(result.length).toBeTruthy();
  });

  it('should create a product from endpoint', async () => {
    const response = await request
      .post('/products')
      .send({ name: 'Fish Tacos', price: 9, category_id: 1 })
      .set({ Authorization: JSON.parse(testUser.text).token });
    expect(response.status).toEqual(200);
  });

  it('should get product by ID from endpoint', async () => {
    const response = await request.get('/products/3');
    const result = JSON.parse(response.text);
    expect(result.name).toEqual('Fish Tacos');
  });

  it('should get product by category from endpoint', async () => {
    const response = await request
      .get('/products/category/1')
      .set({ Authorization: JSON.parse(testUser.text).token });
    const result = JSON.parse(response.text);
    expect(result[2].name).toEqual('Fish Tacos');
  });
});
