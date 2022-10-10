 import { FaTrash, FaUpload } from 'react-icons/fa'
 import { useState } from 'react';
 import { useForm } from 'react-hook-form';
 import { ErrorMessage } from '@hookform/error-message';


 import React from 'react'
 
 export const TodoList = () => {
  const [ newTodo, setNewTodo ] = useState('');

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setNewTodo(''); // add new todo
  // }

  const onSubmit = (data) => {
    console.log(data);
  }

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const newItemSection = 
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Todos</h2>
        <label htmlFor="new-todo">Enter a new todo</label>'
        <div className="new-todo">
          <input
            className="signup__input"
            name="new-todo"            
            type="text"
            id="newTodo"
            placeholder="Enter a new to-do task"  
            value={newTodo}      
            onChange={(e) => setNewTodo(e.target.value)}    
            {...register('new-todo', {
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
    // define additional content

  return (
    <main>
        <h1>Todo List</h1>
        {newItemSection}
        {content}
    </main>
  )
}
 

export default TodoList;