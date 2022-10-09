import React from 'react';
import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import ReactionButtons from './ReactionButtons';
import { Link } from 'react-router-dom';
const PostsExcerpt = ({ post }) => {
  
  
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