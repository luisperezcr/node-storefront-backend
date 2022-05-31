import { CategoryStore } from '../models/categories';
import { Order, OrderWithProducts, OrdersStore } from '../models/orders';
import { ProductsStore } from '../models/products';
import { UserStore } from '../models/users';
import supertest from 'supertest';
import app from '../server';

const store = new OrdersStore();
const userStore = new UserStore();
const productsStore = new ProductsStore();
const categoryStore = new CategoryStore();
const request = supertest(app);
let testUser: any;

const order: Order = {
  username: 'jocko_willink',
  status: 'ACTIVE'
};

const orderWithProducts: OrderWithProducts = {
  id: 1,
  username: 'jocko_willink',
  status: 'ACTIVE',
  products: []
};

describe('Orders Model', () => {
  beforeAll(async () => {
    await userStore.create({
      username: 'jocko_willink',
      firstName: 'Jocko',
      lastName: 'Willink',
      password: 'go-get-some'
    });

    await categoryStore.create({ name: 'Food' });

    await productsStore.create({ name: 'Tacos', price: 9, category_id: 1 });

    testUser = await request.post('/users').send({
      username: 'test-user-2',
      firstName: 'John',
      lastName: 'Doe',
      password: 'im-john-doe'
    });
  });

  it('should have index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have addProduct method', () => {
    expect(store.addProduct).toBeDefined();
  });

  it('should get orders', async () => {
    const result = await store.index();
    expect(result).toEqual([]);
  });

  it('should create an order', async () => {
    const result = await store.create(order);
    expect(result.username).toEqual(order.username);
  });

  it('should get an order by username', async () => {
    const result = await store.show(order.username, 1);
    expect(result).toEqual(orderWithProducts);
  });

  it('should add product to order', async () => {
    const result = await store.addProduct(1, 1, 15);
    expect(Number(result.order_id)).toEqual(1);
  });

  it('should get orders from endpoint', async () => {
    const response = await request.get('/orders').set({ 'Authorization': JSON.parse(testUser.text).token });
    const result = JSON.parse(response.text);
    expect(result.length).toBeTruthy();
  });

  it('should create an order from endpoint', async () => {
    const response = await request.post('/orders')
                                  .send({ username: 'test-user-2' })
                                  .set({ 'Authorization': JSON.parse(testUser.text).token });
    expect(response.status).toEqual(200);
  });

  it('should get orders from endpoint', async () => {
    const response = await request.get('/orders/1/test-user-2').set({ 'Authorization': JSON.parse(testUser.text).token });
    expect(response.status).toEqual(200);
  });

  it('should add product to order from endpoint', async () => {
    const response = await request.get('/orders/1/products')
                                  .send({ product_id: 1, quantity: 5 })
                                  .set({ 'Authorization': JSON.parse(testUser.text).token });
    expect(response.status).toEqual(200);
  });
});
