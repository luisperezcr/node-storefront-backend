import { Category, CategoryStore } from '../models/categories';

const store = new CategoryStore();
const category: Category = {
  name: 'Food'
};

describe('Categories Model', () => {
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
});
