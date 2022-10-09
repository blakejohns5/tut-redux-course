# Async Logic and Thunks

This workspace and notes were coded, following Dave Gray's tutorial:

[React Redux Full Course for Beginners | Redux Toolkit Complete Tutorial](https://www.youtube.com/watch?v=NqzdVN2tyvQ)

Builds off of work on blog posts in Chapter 2.

## Basic info:

- Redux is synchronous, so everything asynchronous has to happen outside the store.
- Redux middleware needed to solve this problem. 
- Thunks are standard Redux middleware for asynchronous code.
- Thunk: piece of code that does delayed work.


## Getting started:

- Change initialState in postsSlice to object. Set initial state for key and values, posts, status, and error.
- Since new state actually is an object and has a posts property, change the reducer so that 'state.' change to 'state.post.'

### Creating Async Thunk for Posts

#### Set up

- Right in postsSlice, import `createAsyncThunk`
- Add POSTS_URL variable to .env, no need for install, but variables must begin with REACT_APP_
- install axios
- createAsyncThunk for fetchPost:

`createAsyncThunk` accepts two arguments:
  1. string that serves as prefix for generated action type
  2. payload creator callback which returns a promise that contains data, or a rejected promise with an error.

#### Add extraReducers(builder)

- In postsSlice, we already have a reducer, but sometimes slice reducer needs to respond to other actions that weren't defined with the slice's reducers...in this case, to do with the fetchPost.
  - After the reducers in the slice, add extraReducers, which accepts a *builder* parameter.
  - The `builder` parameter is an object lets us define additional case reducers that run in response to the actions defined outside the slice.
  
  Continuing from within the slice...
  ```
        existingPost.reactions[reaction]++
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Adding date and reactions
        let min = 1;
        const loadedPosts = action.payload.map(post => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
          }
          return post;
        });
        // add any fetched posts to the array
        //state.posts = state.posts.concat(loadedPosts);
        // note above did not work, sub with below:
        state.posts = loadedPosts;
      })
       .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  }
  ```
  #### Case above in detail:
  The cases are listening for the promise status action types that are disspatched by the fetchPosts thunk. Then we responsd by setting our state accordingly.
  - A promise could be pending, so we set our state.status to 'loading'
  - A promise could be fulfilled, so we set it to 'succeeded' and in this case, returning some info.
    - Since the jsonplaceholder data doesn't have our date, we map over the data to add a date in the format we're using, and changing each so that each has a different timestamp or timeAgo set.
    - Then we also add the reactions, since those aren't included from jsonplaceholder either.
    - Because we're still in the slice and Redux uses ImmerJS, we can use concat method to add to our posts state.
  - A promise could also be rejected, so we add our last case and set state.status to 'failed' as well as a state.error

#### Add selectors for status and error:
```
export const getPostsStatus = (state) => state.posts.status; 
export const getPostsError = (state) => state.posts.error; 
```
- Then we can export and import in PostsLists


### Update the PostsLists component to get postStatus and postError

- Import useDispatch as well, after useSelector, as well as useEffect from 'react'.
- Also import getPostsStatus, getPostsError, and fetchPosts
- Use useSelector to get values from postsStatus and error.
- Add useEffect to check postStatus and dispatch the fetchPosts, if status is idle:
  ```
    useEffect(() => {
    if (postsStatus === 'idle') {
      dispatch(fetchPosts())
    }

  }, [postsStatus,dispatch])
  ```

### Display loading state in postsList

#### Extract part of PostsLists to PostsExcerpt

- Take basic post information returned in PostsList and move to PostsExcerpt.
- In `PostsLists`, create *if else statements* to control what to return, depending on the postsStatus.
- Changed *renderedPosts* to `content` variable inside the jsx.
- Correct errors: add key with *nanoid()* to PostsLists.js.


### Creating Async Thunk for Users

Follow a similar process as with posts.

- Import createAsyncThunk in usersSlice, as well as Axios.
- Use empty array for initial state.
- Add *async thunk* for fetching users. We name the slice, then the function and the callback to return users in an array or an error:
  ```
  export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    try {
      const res = await axios.get(process.env.REACT_APP_USERS_URL);
      return [...res.data];
    } catch (error)  {
      return error.message;
    }
  })
  ```

#### Add extraReducers section

Since the fetch happens outside of the slice, we need the extraReducers section to handle this.

- It receives a builder.
- Here we're only looking for one case: fulfilled. Then the action is the action payload. 
- We return the action.payload.
  ```
  ...
    reducers: {},
    extraReducers(builder) {
      builder.addCase(fetchUsers.fulfilled, (state, action) => {
        return action.payload;
      })
    }
  ```
- Note we could also use *push* or other methods with ImmerJS, but by returning it this way, we are completely overriding the state, and won't accidentally add the users twice.

#### Dispatch fetchUsers async thunk

- Go to index.js, because we want to load the users right when the app starts.
- import the fetchUsers, and add line to fetchUsers immediately: 
  ```
  store.dispatch(fetchUsers());
  ```


### Change how posts are added

#### Async Thunk for adding posts

- Create the new thunk in postsSlice.js
```
export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
  try {
    const res = await axios.post(process.env.REACT_APP_POSTS_URL, initialPost)
    return res.data;
  } catch (error) {
    return error.message;
  }
});
```
- Add a new case to the extraReducers for fetchUsers, for fulfilled after adding new posts:
```
.addCase(addNewPost.fulfilled, (state, action) => {
  action.payload.userId = Number(action.payload.userId);
  action.payload.date = new Date().toISOString();
  action.payload.reactions = {
    thumbsUp: 0,
    wow: 0,
    heart: 0,
    rocket: 0,
    coffee: 0
  }
  console.log(action.payload)
  state.posts.push(action.payload)
})
```
Note above that again we create the date and reactions for the case, since the API doesn't provide these.

#### Make changes to load the new posts from the thunk

- Go to AddPostForm.js, and change the *postAdded* import for the *addNewPost*.
- add new state for addRequestStatus / setAddRequestStatus.
- Refactor the canSave using every method and add a check that the addRequestStatus is equal to 'idle'.
-Refactor the onSavePostClicked function:
  ```
  const onSavePostClicked = (data) => {
      if (canSave) {
        try {
          setAddRequestStatus('pending');
          dispatch(addNewPost({ title, body: content, userId })).unwrap();

          setTitle('');
          setContent('');
          setUserId('');
        } catch(error) {
          console.error('Failed to save the post', error)
        } finally {
          setAddRequestStatus('idle')
        }
      } 
    }

  ```
  Above, we...
    - Set the addRequestStatus to pending (then back to idle at the end of function.)
    - Note Redux Toolkit adds an `unwrap()` function to the returned promise, and then that returns a new promise that either has the action payload *or* it throws an error if it's the rejected action. This lets us use the try / catch structure. 
