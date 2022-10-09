import React from 'react';
import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import ReactionButtons from './ReactionButtons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectPostById } from './postsSlice';



const PostsExcerpt = ({ postId }) => {
  const post = useSelector(state => selectPostById(state, postId))
  
  return (
    <article key={post.id}>
      <h2>{post.title}</h2>
      <p className="post__excerpt">{post.body.substring(0, 75)}</p> 
      <p className="post__credit">
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionButtons post={post} />
    </article>
  )
}


export default PostsExcerpt;