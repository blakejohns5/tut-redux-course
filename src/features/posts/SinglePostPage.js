import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";

import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";

import React from 'react'
import { useParams } from 'react-router-dom';

const SinglePostPage = ( ) => {
  // retrieve postId
  const postId = useParams().postId;
  console.log(postId)

  const post = useSelector((state) => selectPostById(state, Number(postId)))

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }


  return (
    <article>
    <h3>{post.title}</h3>
    <p>{post.body}</p> 
    <p className="post_credit">
      <PostAuthor userId={post.userId} />
      <TimeAgo timestamp={post.date} />
    </p>
    <ReactionButtons post={post} />
  </article>
  )
}

export default SinglePostPage