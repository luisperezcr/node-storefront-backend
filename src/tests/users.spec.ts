import { User, UserStore } from "../models/users";
import bcrypt from 'bcrypt';

const store = new UserStore();
const user: User = {
  username: 'jocko_willink',
  firstName: 'Jocko',
  lastName: 'Willink',
  password: 'go-get-some'
};

describe('Users Model', () => {
  it('should have index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });

  it('should get users', async() => {
    const users = await store.index();
    expect(users).toEqual([]);
  });

  it('should create a user & encryp password', async() => {
    const spy = spyOn(bcrypt, 'hashSync').and.callThrough();
    const result: User = await store.create(user);
    expect(result.username).toEqual(user.username);
    expect(spy).toHaveBeenCalled();
  });

  it('should get user by username', async() => {
    const result = await store.show(user.username);
    expect(result.username).toEqual(user.username);
  });

  it('should return null if user does not exist', async() => {
    const result = await store.show('random-username');
    expect(result).toBeFalsy();
  });

  it('should authenticate user', async() => {
    const spy = spyOn(bcrypt, 'compareSync').and.callThrough();
    const result = await store.authenticate(user.username, user.password);
    expect(result).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('should return null if authentication fails', async() => {
    const result = await store.authenticate(user.username, 'random-password');
    expect(result).toBeFalsy();
  });
});