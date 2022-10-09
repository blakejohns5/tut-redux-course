import { useSelector } from 'react-redux';
import { selectAllPosts, getPostsStatus, getPostsError } from './postsSlice';

import PostsExcerpt from './PostsExcerpt';
import { nanoid } from '@reduxjs/toolkit';


const PostsList = () => {
     
  const posts = useSelector(selectAllPosts);
  const postsStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);



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
      {content}
    </section>
  )
}

export default PostsList;