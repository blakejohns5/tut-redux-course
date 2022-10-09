# Blog App

This workspace and notes were coded, following Dave Gray's tutorial:

[React Redux Full Course for Beginners | Redux Toolkit Complete Tutorial](https://www.youtube.com/watch?v=NqzdVN2tyvQ)

Builds off of work on blog posts in Chapter 3.
The bulletin board app will be re-factored into multi-page blog with full CRUD operations.

## Implement Post View, page where we can see one post

- Add new selector to postSlice to get a single post, taking in both the state and the postId
  ```
  export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)
  ```
- Create SinglePostPage.js, similar to the PostsExcerpt page, but not the same. 
  - Note when we create the post variable, we use an anonymous function so that we can pass the *state in as well as the postId*.
  - Another difference from PostsExcerpt is that we will return the full post if it is found, and not a substring.

- Since this is a multi-page blog, install react-router-dom to index.js

- Create Components folder in src, and add Layout.js for implementing `Outlet`. Used commonly for including headers and footers.
- Add new Routes to App.js
- Go back to SinglePostPage.js, and allow page to get postId through useParams() hook. Change post variable so that postId is definitely `Number()`.

- In PostsExcerpt, add a css class for the post body and limit the substring a bit more.
- Create a `Link` to each excerpt:
  ```
  <Link to={`post/${post.id}`}>View Post</Link>
  ```

## Add Layout View

- Create components folder, and add file for layout component.
- In Layout, include `Outlet` from react-router-dom.
- Then include layout as `Route` encompassing all others in App.js, and add Routing to index, then to path 'post'. Within path 'post', link to index for AddPostForm and postId for SinglePostPage.
- Create Header component and include in Layout.js.

## Edit Post Page

- Go to SinglePostPage.js, and import `Link` from react-router-dom.
- Add Link to returned jsx, above PostAuthor and TimeAgo:
  ```
  <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
  ```
- Create the EditPostForm.js and add code, mixing elements of SinglePostPage and AddPostForm.
  - Here we add a bit more information when dispatching the new post information for the update, and we also use useNavigate() to see the new post when we're finished.

- Add updatePost thunk to postsSlice
- Add case to extraReducers in postsSlice

## Delete Post Page

- Repeat steps from Edit Post Page, with a few changes.
- Add delete function to EditPostForm, then button with onClick that calls the delete function.

## Correction Refresh issue

If you refresh from the SinglePostPage, this leads you to page not found.
- You can dispatch the fetchPosts from the index, as was earlier done with users.
- Then go to the PostsLists page and remove unnecessary elements: useDispatch, fetchPosts, etc.


