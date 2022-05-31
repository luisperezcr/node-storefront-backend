import { User, UserStore } from '../models/users';
import bcrypt from 'bcrypt';
import supertest from 'supertest';
import app from '../server';

const request = supertest(app);
let testUser: { text: string };
const store = new UserStore();
const user: User = {
  username: 'luis_perez',
  firstName: 'Luis',
  lastName: 'Perez',
  password: 'go-get-some'
};

describe('Users Model', () => {
  beforeAll(async () => {
    testUser = await request.post('/users').send({
      username: 'test-user-4',
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

  it('should have authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });

  it('should get users', async () => {
    const users = await store.index();
    expect(users.length).toBeGreaterThan(0);
  });

  it('should create a user & encryp password', async () => {
    const spy = spyOn(bcrypt, 'hashSync').and.callThrough();
    const result: User = await store.create(user);
    expect(result.username).toEqual(user.username);
    expect(spy).toHaveBeenCalled();
  });

  it('should get user by username', async () => {
    const result = await store.show(user.username);
    expect(result.username).toEqual(user.username);
  });

  it('should return null if user does not exist', async () => {
    const result = await store.show('random-username');
    expect(result).toBeFalsy();
  });

  it('should authenticate user', async () => {
    const spy = spyOn(bcrypt, 'compareSync').and.callThrough();
    const result = await store.authenticate(user.username, user.password);
    expect(result).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('should return null if authentication fails', async () => {
    const result = await store.authenticate(user.username, 'random-password');
    expect(result).toBeFalsy();
  });

  it('should get users from endpoint', async () => {
    const response = await request
      .get('/users')
      .set({ Authorization: JSON.parse(testUser.text).token });
    const result = JSON.parse(response.text);
    expect(result.length).toBeTruthy();
  });

  it('should get an user from endpoint', async () => {
    const response = await request
      .get('/users/test-user-4')
      .set({ Authorization: JSON.parse(testUser.text).token });
    const result = JSON.parse(response.text);
    expect(result.firstname).toEqual('John');
  });

  it('should authenticate an user', async () => {
    const response = await request
      .post('/users/authenticate')
      .send({ username: 'test-user-4', password: 'im-john-doe' });
    const result = JSON.parse(response.text);
    expect(result.token).toBeTruthy();
  });
});
