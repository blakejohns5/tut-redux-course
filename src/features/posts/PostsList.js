import { useSelector, useDispatch } from 'react-redux';
import { selectAllPosts, getPostsStatus, getPostsError, fetchPosts } from './postsSlice';
import { useEffect } from 'react';
import PostsExcerpt from './PostsExcerpt';
import { nanoid } from '@reduxjs/toolkit';


const PostsList = () => {
  const dispatch = useDispatch();
     
  const posts = useSelector(selectAllPosts);
  const postsStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  useEffect(() => {
    if (postsStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postsStatus,dispatch])

  let content;
  if (postsStatus === 'loading') {
    content = <p>"Loading...</p>;
  } else if (postsStatus === 'succeeded') {
    const orderedPosts = posts.slice().sort((a,b) => b.date.localeCompare(a.date));
    content = orderedPosts.map(post => <PostsExcerpt key={nanoid()} post={post} />)  
  } else if (postsStatus === 'failed') {
    content = <p>{error}</p>;
  }
 
  return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  )
}

export default PostsList;