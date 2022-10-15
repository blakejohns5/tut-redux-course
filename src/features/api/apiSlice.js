import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const apiSlice = createApi({
  reducerPath: 'api', 
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_JSON_SERVER }),
  tagTypes: ['Todos'],
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => '/todos',
      transformResponse: res => res.sort((a, b) => b.id - a.id),
      providesTags: ['Todos']
    }),
    addTodo: builder.mutation({
      query: (todo) => ({
        url: '/todos',
        method: 'POST',
        body: todo,
      }),
      invalidatesTags: ['Todos']
    }),
    updateTodo: builder.mutation({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: 'PATCH',    // replace part of the record
        body: todo,
      }),
      invalidatesTags: ['Todos']
    }),
    deleteTodo: builder.mutation({
      query: ({ id }) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
        body: id,
      }),
      invalidatesTags: ['Todos'],
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
