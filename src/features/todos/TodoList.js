import { useAddTodoMutation, useGetTodosQuery, useUpdateTodoMutation, useDeleteTodoMutation } from '../api/apiSlice';
import { FaUpload, FaTrash } from 'react-icons/fa'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';


export const TodoList = () => {
  const [ newTodo, setNewTodo ] = useState('');
  // use / define the hook from apiSlice
  const {
    data: todos,
    isLoading,
    isSuccess,
    isError,
    
  } = useGetTodosQuery();

  // get the functions from the other apiSlice hooks
  const [ addTodo ] = useAddTodoMutation();
  const [ updateTodo ] = useUpdateTodoMutation();
  const [ deleteTodo ] = useDeleteTodoMutation();


  const onSubmit = (data) => {
    addTodo({ 
      userId: 1, 
      title: data.newTodo, 
      completed: false })
    setNewTodo('');
  }

  const { register, handleSubmit, formState: { errors } } = useForm();

  const newItemSection =
    <form className='todo-form' onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="new-todo"></label>
      <div className="new-todo">
        <input
          className="signup__input"
          name="new-todo"
          type="text"
          placeholder="Enter a new to-do task"
          defaultValue={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          {...register('newTodo', {
            required: 'A to-do task is required',
          })}
        />
      </div>
      <ErrorMessage errors={errors} name="new-todo" as="p" />
      <button className="submit">
        <FaUpload />
      </button>
    </form>

    let content;
    if (isLoading) {
      content = <p>Loading...</p>
    } else if (isSuccess) {
      content = todos.map(todo => (
        <article className="todo-item"key={todo.id}>
          <div className="todo">
            <input
              type="checkbox"
              checked={todo.completed}
              id={todo.id}
              onChange={() => updateTodo({...todo, completed: !todo.completed })}
            />
            <label htmlFor={todo.id}>{todo.title}</label>
          </div>
          <button className='trash' onClick={() => deleteTodo({ id: todo.id })}>
            <FaTrash />
          </button>
        </article>
      ))
    } else if (isError) {
      content = <p>{isError?.error}</p> // not sure about this, but todos render and error goes away
    }

  return (
    <>
    <main>
        <h1>Todo List</h1>
        {newItemSection}
        {content}
    </main>
    </>
  )
}


export default TodoList;