import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const apiSlice = createApi({
  reducerPath: 'api', 
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_JSON_SERVER }),
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => '/todos',
    }),
    addTodo: builder.mutation({
      query: (todo) => ({
        url: '/todos',
        method: 'POST',
        body: todo,
      })      
    }),
    updateTodo: builder.mutation({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: 'PATCH',    // replace part of the record
        body: todo,
      })
    }),
    deleteTodo: builder.mutation({
      query: ({ id }) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
        body: id,
      })
    })
  })
})

// RTK Query creates custom hooks based on the methods we provide
export const { 
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = apiSlice;
