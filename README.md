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

- Since this is a multi-page blog, install react-router-dom

