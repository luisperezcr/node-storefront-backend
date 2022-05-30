# API Requirements
Before testing any other endpoint, do the following:

1. Create an user (for payload data, take a look at `Users` section): `[POST] localhost:3000/users`.
2. The previous call will return a JSON object with some data. From that object get the value of the `token` without the quotes.
3. Once you copied the `token` from previous step, you will need to add it to the `Authorization` header in Postman. To do that go to the `Headers` section in Postman, as `Key` select `Authorization` and as `Value` paste the whole token string, including the `Bearer `.
4. Once that's done, you will have access to the secured API calls.

---

## API Endpoints

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
    "password": "my-password"
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

## Data Shapes

### Users
  ```sql
  username: VARCHAR(50) PRIMARY KEY,
  firstname: VARCHAR(50),
  lastName: VARCHAR(50),
  password: TEXT
  ```

### Categories
  ```sql
  id: SERIAL PRIMARY KEY,
  name: VARCHAR(100)
  ```

### Products
  ```sql
  id: SERIAL PRIMARY KEY,
  name: VARCHAR(100),
  price: INTEGER,
  category_id: BIGINT REFERENCES categories(id)
  ```

### Orders
  ```sql
  id: SERIAL PRIMARY KEY,
  username: VARCHAR(50) REFERENCES users(username),
  status: VARCHAR(15) 'ACTIVE|COMPLETE'
  ```

### Orders_Products
  ```sql
  order_id: BIGINT REFERENCES orders(id),
  product_id: BIGINT REFERENCES products(id),
  quantity: INTEGER
  ```