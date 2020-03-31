# Shortlink Generator

The following project provides a base for building a shortlink generating
application like https://bit.ly.

In this repository you will find:

- A backend server running [Express](https://expressjs.com/)
  - Start it with `yarn backend` or `npm run backend`

It will be responsible for building the backend API

### `npm run serve`

Runs the shortlinks backend server.<br/>
Open http://localhost:8181 to view it in the browser.

### API TOKEN

To Access the APIs, you need to authenticate via Google OAUTH, to get the authentication token,

Go to `http://localhost:8181/auth/google` and it will configure the access_token into the cookies and subsequent request takes the token to
`CREATE` the Short Url and visit the links via the same user.

#### LIST 

GET `http://localhost:8181/api/links` gives the json

#### CREATE

POST `http://localhost:8181/api/links` with request body `{longUrl: 'http://google.com'}` 

