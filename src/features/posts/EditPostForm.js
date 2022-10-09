import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPostById, updatePost, deletePost } from './postsSlice';
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';

import { selectAllUsers } from '../users/usersSlice';

import React from 'react'

const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const post = useSelector((state) => selectPostById(state, Number(postId)));
  const users = useSelector(selectAllUsers);

  const [ title, setTitle ] = useState(post?.title);
  const [ content, setContent ] = useState(post?.body);
  const [ userId, setUserId ] = useState(post?.userId);
  const [ requestStatus, setRequestStatus ] = useState('idle');

  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const canSave = [title, content, userId].every(Boolean) && requestStatus === 'idle';

  

  const onSavePostClicked = (data) => {    
    if (canSave) {
      try {
        setRequestStatus('pending');
        dispatch(updatePost({ id: postId, title, body: content, userId, reactions: post.reactions })).unwrap();

        setTitle('');
        setContent('');
        setUserId('');
        navigate(`/post/${postId}`);
      } catch(error) {
        console.error('Failed to save the post', error)
      } finally {
        setRequestStatus('idle')
      }
    } 
  }

  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>     
  ))

  const onDeletePostClicked = (data) => {
    try {
      setRequestStatus('pending');
      dispatch(deletePost({ id: post.id })).unwrap();

      setTitle('');
      setContent('');
      setUserId('');
      navigate('/');
    } catch (error) {
      console.error('Failed to delete post', error)
    } finally {
      setRequestStatus('idle')
    }
  }

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
            defaultValue={userId}
            // value={userId}    // cannot be both controlled / uncontrolled
            {...register("author", {
              onChange: (e) => {setUserId(Number(e.target.value))},
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
            className="btn__save" 
            type="submit"
            disabled = { !canSave && true }
          >Save Post</button>
           <button 
            className="btn__delete" 
            type="button"
            onClick={onDeletePostClicked}
          >Delete Post</button>
        </article>
      </form>
    </section>
    
  )
}

export default EditPostForm