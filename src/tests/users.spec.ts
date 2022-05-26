import { User, UserStore } from "../models/users";

const store = new UserStore();

describe('Users Model', () => {
  it('should have index method', () => {
    expect(store.index).toBeDefined();
  });
});