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

## Set up
1. Run `npm i` to install all `node_modules` required.

2. In your root folder create an `.env` file and add your variables. The following is an example of the require variable by this project, feel free to add more if needed. Replace the string inside `<>` for whatever you want.
    ```
    POSTGRES_HOST=127.0.0.1
    POSTGRES_DB_DEV=<NAME_OF_DATABASE>-dev
    POSTGRES_TEST_DB=<NAME_OF_DATABASE>-test
    POSTGRES_USER=<YOUR_USER>
    POSTGRES_PWD=<YOUR_PASSWORD>
    ENV=test
    BCRYPT_PASSWORD=<ANY_STRING_YOU_WANT>
    SALT_ROUNDS=10
    TOKEN_SECRET=<ANY_STRING_YOU_WANT>
    ```
3. Regardless of using your local machine or a docker container, make sure you create 2 databases, once for `test` and another one for `dev`. Also, make sure you're using the same names your set on your `.env` file for `POSTGRES_DB_DEV` and `POSTGRES_TEST_DB`. So, for example if you used `my_database_dev` in your `.env` file, that's the name you will need to use to create the database, the same for the `test` one.

---

## Run the project

1. To execute the project run `npm run watch`, this will create a local environment on port `3000` that will be accesible at `localhost:3000`.
2. To hit any endpoint make sure you are using `localhost:3000`, so URLs will look like this: `localhost:3000/orders`

---

## Hit endpoints
See the [REQUIREMENTS](https://github.com/luisperezcr/node-storefront-backend/blob/main/REQUIREMENTS.md) file.