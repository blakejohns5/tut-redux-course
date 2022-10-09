import React from 'react';
import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import ReactionButtons from './ReactionButtons';

const PostsExcerpt = ({ post }) => {
  
  
  return (
    <article key={post.id}>
    <h3>{post.title}</h3>
    <p>{post.body.substring(0, 100)}</p> 
    <p className="post_credit">
      <PostAuthor userId={post.userId} />
      <TimeAgo timestamp={post.date} />
    </p>
    <ReactionButtons post={post} />
  </article>
  )
}

export default PostsExcerpt;