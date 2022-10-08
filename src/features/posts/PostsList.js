import { useSelector } from 'react-redux';
import { selectAllPosts } from './postsSlice';
import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import ReactionButtons from './ReactionButtons';

const PostsList = () => {
  
  // const posts = useSelector(state => state.posts);    // accesses state
  // better replacement, in case future changes
  const posts = useSelector(selectAllPosts);
  
  // localeCompare returns dates in order, slice makes shallow copy of sorted array
  // then we can map over this array, and most recent posts will appear at the top
  const orderedPosts = posts.slice().sort((a,b) => b.date.localeCompare(a.date));
  orderedPosts.map(post => console.log(post))
   
  const renderedPosts = orderedPosts.map(post => (
    <article key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content.substring(0, 100)}</p>
      <p className="post_credit">
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionButtons post={post} />
    </article>
  ));
   
  return (
    <section>
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}

export default PostsList;