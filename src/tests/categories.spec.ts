import { Category, CategoryStore } from '../models/categories';
import supertest from 'supertest';
import app from '../server';

const request = supertest(app);
let testUser: any;
const store = new CategoryStore();
const category: Category = {
  name: 'Food'
};

describe('Categories Model', () => {
  beforeAll(async () => {
    testUser = await request.post('/users').send({
      username: 'test-user-1',
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

  it('should get categories', async () => {
    const result = await store.index();
    expect(result).toEqual([]);
  });

  it('should create a category', async () => {
    const result = await store.create(category);
    expect(result.name).toEqual(category.name);
  });

  it('should get a category by ID', async () => {
    const result = await store.show(1);
    expect(result?.name).toEqual(category.name);
  });

  it ('should get categories from endpoint call', async () => {
    const response = await request.get('/categories');
    const result = JSON.parse(response.text);
    expect(result.length).toBeTruthy();
  });

  it('should create a category from endpoint call', async () => {
    const response = await request.post('/categories')
                                  .send({ name: 'Office' })
                                  .set({ 'Authorization': JSON.parse(testUser.text).token });
    const result = JSON.parse(response.text);
    expect(result.name).toEqual('Office');
  });

  it('should get a category by ID from endpoint', async () => {
    const response = await request.get('/categories/1').set({ 'Authorization': JSON.parse(testUser.text).token });
    const result = JSON.parse(response.text);
    expect(result.name).toEqual('Food');
  });
  
  it('should response with access denied if token is not provided', async () => {
    const response = await request.get('/categories/1');
    expect(response.text).toEqual('"Access denied, invalid token."');
  });
});
