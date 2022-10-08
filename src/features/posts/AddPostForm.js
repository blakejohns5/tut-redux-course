import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';

import { postAdded } from './postsSlice';
import { selectAllUsers } from '../users/usersSlice';

const AddPostForm = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');

  const users = useSelector(selectAllUsers);
  
  const onSavePostClicked = (data) => {
    
    const { title, content } = data;

    if (title && content) {
      dispatch(
        postAdded(title, content, userId)
      )
      setTitle('');
      setContent('');
    }
  }

  const canSave = Boolean(title) && Boolean(content) && Boolean(userId);

  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>     
  ))
  
  
  return (
    <section className='form__add-post'> 
      <h2>Add a New Post</h2>
      <form onSubmit={handleSubmit(onSavePostClicked)}>
        <article className='post__article'>
          <label>Post Title:</label>
          <input
          className='form__post-title'
            id="postTitle"            // ? necessary in react-hook-forms
            name="postTitle"          // ? necessary in react-hook-forms
            label="Post Title:"
            type="text"
            placeholder="Post Title"
            value={title}
            {...register("title", {
              onChange: (e) => {setTitle(e.target.value)},
              required: 'Post Title is required'
            }) }
          />
        </article>
        <label>Author:</label>
        <article className='post__article'>
          <select 
            id="postAuthor"
            value={userId}
            {...register("author", {
              onChange: (e) => {setUserId(e.target.value)},
              required: 'Author is required'
            }) }
          >
            <option value=""></option>
            {usersOptions}
          </select>
        </article>


        <article className='post__article'>
        <label>Post Content:</label>
        <textarea
          className="form__post-content"
          id="postContent"      // ? necessary in react-hook-forms
          name="postContent"    // ? necessary in react-hook-forms
          label="Content:"
          type="text"
          placeholder="Post Content"
          value={content}
          {...register("content", {
            onChange: (e) => {setContent(e.target.value)},
            required: 'Post Content is required'
          }) }
        />
        </article>
        <article className="post__article">
          <button 
            className="btn__post" 
            type="submit"
            disabled = { !canSave && true }
          >Save Post</button>
        </article>
      </form>
    </section>
    
  )
}

export default AddPostForm