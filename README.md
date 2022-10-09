# Optimize Blog App

This workspace and notes were coded, following Dave Gray's tutorial:

[React Redux Full Course for Beginners | Redux Toolkit Complete Tutorial](https://www.youtube.com/watch?v=NqzdVN2tyvQ)

Builds off of work on blog app in Chapter 4.
Optimizations will be added to blog app.

## Add component for users

- Add UsersList.js component, to show users on user page.
- Create selector for users by id on users slice.
  ```
  export const selectUserById = (state, userId) => state.users.find(user => user.id === userId);
  ```
- Create Users Page. No new code, but use new functions to get posts for an individual user:

  ```
   const postsForUser = useSelector(state => {
    const allPosts = selectAllPosts(state);
    return allPosts.filter(post => post.userId === Number(userId));
  })
  ```

  and to retrieve the titles for the given posts.

  ```
  const postTitles = postsForUser.map(post => (
    <li key={post.id}>
      <Link to={`/post/${post.id}`}>{post.title}</Link>
    </li>
  ))

- In App.js, import UsersList and UserPage, and Navigate. 
- Then add another route for Users, with pages for the UsersList and UserPage inside, with their respective paths.
- Lastly, add a catch-all route that uses `Navigate` to re-route back to home page, replacing the bad route with the new route in history.
- Add one more link to the Header for users.

Now the links for users and their posts should be working.

## Add counter to demonstrate optimization methods

- In postsSlice, add count: 0 to initialState.
  - Since we're not using the AddPost anymore, this can be removed.
  - After reactionsAdded reducer, we can add a new reducer to simply increase the count. Then add a getCount to the selectAll... functions:
  ```
  export const getCount = (state) => state.posts.count; 
  ```
  - Don't forget to save export changes.
- Then, go to Header, add imports and code in order to add the count under the unordered list.

## Check the code with React Dev Tools

### Example of rendering too much with counter

- To see renders, click on the count button from the page for a specific user and record.
- This way, we can see we're rendering the user page every time we click on a button from the users post page, even though the count button has nothing to do with the user page.

To find the issue:
  - Go to the UserPage component
  - Here the issue with using filter is that it returns a new array every time.

To fix this:
  - Use a memoized selector. 
  - Go to postsSlice, clean up imports, and add import for `createSelector`
  - Then create a new selector at the bottom, using `createSelector`. 
  
  Note the arguments are dependencies, so renders will only change when they're changed:
  ```
  export const selectPostByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.userId === userId)
  )
  ```
  - Lastly, go back to the UserPage and change out the filter function to use the createSelector.
  This fixes our rendering of the Users Page.

### Checking the homepage with dev tools, fix re-render

#### Method 1: React.memo()

- On the home page, if we check with dev tools, the blog entries get re-rendered every time we click on an emoji.
- Since the error and re-renders occur in PostsExcerpt, go there to check:
  - Change the const to a let. Then at the bottom, use React.memo to fix the issue. This will keep the Excerpt from re-rendering if the prop data doesn't change.
  ```
  PostsExcerpt = React.memo(PostsExcerpt);
  ```
- There's nothing wrong with using this fix, but `state normalization` is generally recommended.

#### Method 2: State Normalization

Normalization:
  - Recommended in docs
  - No duplication of data
  - Creates an ID lookup

- Set your state shape
- Redux Toolkit offers `createEntityAdapter API`
  - Abstracts more logic from components
  - Built-in CRUD methods
  - Automatic selector generation

Get started with Normalized State in the postsSlice file.
  - Import the `createEntityAdapter`
  - Create postsAdapter and change initial state to use it. Note we also remove the empty array in initial state, because the entities object will already be returned:
  ```
  const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
  })
  
  const initialState = postsAdapter.getInitialState({
  status: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  count: 0,
  }) 
  ```
  - Change the find function in reactionAdded reducer. Here using 'entities' object functions as a lookup:
  ```
  const existingPost = state.entities[postId];
  ```
  - Then in the builder cases, look at the fulfilled cases. This is because the postAdapter has its own CRUD methods:
    - fetchPosts fulfilled: 
      ```
      postsAdapter.upsertMany(state, loadedPosts);
      ```
    - addNewPost fulfilled:
      ```
      postsAdapter.addOne(state, action.payload);
      ```
    - updatePost fulfilled, more than one line commented out and replaced by:
      ```
      postsAdapter.upsertOne(state, action.payload);
      ```
    - deletePost fulfilled, more than one line commented out and replaced by:
      ```
      postsAdapter.removeOne(state, id);
      ```
  - Selectors also need to be changed, to use `getSelector`:
    - We can remove selectAllPosts and getPostsById, because they're automatically created.
    - This is how selectors are automatcally created using `getSelector`. It creates the following selectors, and we rename them with aliases using destructuring. Then pass in a selector that returns the posts slice of state (here, state=>state.posts):
      ```
      export const {
        selectAll: selectAllPosts,
        selectById: selectPostById,
        selectIds: selectPostIds,
        
      } = postsAdapter.getSelectors(state => state.posts);
      ```

- To take advantage of these changes, go to PostsList:
  - Import SelectPostIds instead of selectAllPosts.
  - Where selectAllPosts was used, exchange for:
    ```
    const orderedPostIds = useSelector(selectPostIds);
    ```
  - Where content is decided, comment the line that was solved with the createEntityAdapter in postSlice:
    `const orderedPosts = posts.slice().sort((a,b) => b.date.localeCompare(a.date));`
    Change content value to:
    ```
    content = orderedPostIds.map(postId => <PostsExcerpt key={nanoid()} postId={postId} />)
    ```
- Go to PostsExcerpt:
  - Make changes to imports.
  - Change the prop from post to postId.
  - Declare the post variable.

#### Summary

- We simplified the postSlice 
- We used the adapter CRUD methods
- It created selectors for us that we destructured and with aliases, renamed as we had before.
- We pulled more logic from our components and moved it to the postSlice.
- Now the homepage only re-renders the post excerpt that gets the emoji reaction.

Using the profiler on React Dev Tools, this fixes the over-rendering on the homepage.