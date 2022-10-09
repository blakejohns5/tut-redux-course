import { useSelector } from 'react-redux';
import { selectPostIds, getPostsStatus, getPostsError } from './postsSlice';

import PostsExcerpt from './PostsExcerpt';
import { nanoid } from '@reduxjs/toolkit';


const PostsList = () => {
     
  const orderedPostIds = useSelector(selectPostIds);
  const postsStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);



  let content;
  if (postsStatus === 'loading') {
    content = <p>"Loading...</p>;
  } else if (postsStatus === 'succeeded') {
    // next line not needed, now taken care of by the createEntityAdapter in postSlice
    // const orderedPosts = posts.slice().sort((a,b) => b.date.localeCompare(a.date));
    content = orderedPostIds.map(postId => <PostsExcerpt key={nanoid()} postId={postId} />)  
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