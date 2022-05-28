# Node Store Front Backend
This is an API created for project: `Node Store Front Backend` in the `FullStack JavaScript Developer Nanodegree` by [Udacity](https://udacity.com).

---
## Scripts

First run `npm i` to installl all `node_modules`.
### Run local environment (refreshes automatically on save)
* `npm run watch`

### Unit Tests
* `npm run test`

### Apply Prettier
* `npm run prettier`

### Build app
* `npm run build`

### Run linter to check code
* `npm run lint`

---

## API Endpoints

***Use Postman to test the API***

Before testing any endpoint run `npm run watch` to start a local environment.

The first thing you need to do after starting a local environment is to create an user to generate an *Authorization Token* that will be use to secure some of the API calls. To do that follow the next steps:

1. Create an user (for payload data, take a look at `Users` section): `[POST] localhost:3000/users`.
2. The previous call will return a JSON object with some data. From that object get the value of the `token` without the quotes.
3. Once you copied the `token` from previous step, you will need to add it to the `Authorization` header in Postman. To do that go to the `Headers` section in Postman, as `key` select `Authorization` and as `Value` paste the whole token string, including the `Bearer `.
4. Once that's done, you will have access to the secured API calls.

### Users
- Get all users: `[GET] localhost:3000/users`
- Create a user: `[POST] localhost:3000/users`. Expected payload:
  ```json
  {
    "username": "my-username",
    "password": "my-password",
    "firstName": "Name",
    "lastName": "Lastname"
  }
  ```
- Get a user: `[GET] localhost:3000/users/:username`
- Authenticate a user: `[POST] localhost:3000/users/authenticate`. Expected payload:
  ```json
  {
    "username": "my-username",
    "password": "my-password
  }
  ```

### Categories
- Get all categories: `[GET] localhost:3000/categories`
- Create a category: `[POST] localhost:3000/categories`. Expected payload:
  ```json
  {
    "name": "Food"
  }
  ```

- Show a category by ID: `[GET] localhost:3000/categories/:id`


### Products
- Get all products: `[GET] localhost:3000/products`
- Show a product by ID: `[GET] localhost:3000/products/:id`
- Create a product: `[POST] localhost:3000/products`. Expected payload:
  ```json
  {
    "name": "Tacos",
    "price": 6,
    "category_id": 1 
  }
  ```
- Get products by category: `[GET] localhost:3000/products/category/:id`

### Orders
- Get all orders: `[GET] localhost:3000/orders`
- Create an order: `[POST] localhost:3000/orders`. Expected payload (as `username` use the same username you used to create the user when generating the auth token):
  ```json
  {
    "username": "my-username",
    "status": "COMPLETE"
  }
  ```
- Get an order: `[GET] localhost:3000/orders/:id/:username`
- Add a product to an order: `[POST] localhost:3000/orders/:id/products`. Expected payload:
  ```json
  {
    "product_id": "1",
    "quantity": "15"
  }
  ```