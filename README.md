# Optimize Blog App

This workspace and notes were coded, following Dave Gray's tutorial:

[React Redux Full Course for Beginners | Redux Toolkit Complete Tutorial](https://www.youtube.com/watch?v=NqzdVN2tyvQ)

Builds off of work off work in previous chapters.
RTK Query will be used to work on a todo app.

## Getting started

- install json server `npm i json-server -g` (globally)
- add json server to scripts in package.json

## Create apiSlice

- Just as with slices, we create one to use RTK Query.
- Create api folder in features, then apiSlice.js, and import: `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';`


- Then we create the actual apiSlice component. We use createApi, which accepts an object.
  - The first property in the object is the `reducerPath: 'api'`. This is the default, so even if we didn't put this, it would default to this value.
  - The second is the `baseQuery`. This uses `fetchBaseQuery` which we imported, and we define a base URL.
  - From there we define endpoints for the api to interact with. These use something similar to builder cases that we have in Redux Toolkit. We pass in a builder, and then define methods to interact with the API.

  See code:
  ```
    export const apiSlice = createApi({
    reducerPath: 'api', 
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_JSON_SERVER }),
    endpoints: (builder) => ({
      getTodos: builder.query({
        query: () => '/todos',
      })
    })
  })
  ```

RTK Query creates custom hooks based on the methods that we provide. We can then simply export:
```
  export const {
    useGetTodosQuery
  } = apiSlice;
```

## Set up index.js to use apiSlice

- Go to index.js and import the `ApiProvider` and the `apiSlice`.
- Wrap the `<App />` component in the `<ApiProvider api={apiSlice} >` and pass in the `apiSlice` as a prop.

## Put the hook to use

- In TodoList.js, import the hook: `import { useGetTodosQuery } from '../api/apiSlice';`
