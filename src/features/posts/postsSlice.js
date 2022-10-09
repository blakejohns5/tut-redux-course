import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import axios from 'axios';


// add postsAdapter
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})


const initialState = postsAdapter.getInitialState({
  status: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  count: 0,
})

// add async code 
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  try {
    const res = await axios.get(process.env.REACT_APP_POSTS_URL)
    return [...res.data];
  } catch (err) {
    return err.message;
  } 
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
  try {
    const res = await axios.post(process.env.REACT_APP_POSTS_URL, initialPost)
    return res.data;
  } catch (error) {
    return error.message;
  }
});

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
  const { id } = initialPost;
  try {
    const res = await axios.put(`${process.env.REACT_APP_POSTS_URL}/${id}`, initialPost)
    return res.data;
  } catch (error) {
    return error.message;
  }
});

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
  const { id } = initialPost;
  try {
    const res = await axios.delete(`${process.env.REACT_APP_POSTS_URL}/${id}`, initialPost)
    if (res?.status === 200) return initialPost;
    return `${res?.status}: ${res?.statusText}`;
  } catch (error) {
    return error.message;
  }
});


const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    increaseCount(state, action) {
      state.count = state.count + 1;  // note ++ does not work here.
    },
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
        // state.posts = state.posts.concat(loadedPosts);
        // note above did not work, sub with below:
        // state.posts = loadedPosts;
        // use with postsAdapter
        postsAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        console.log('dispatched')
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
        // state.posts.push(action.payload)
        // use with adapter
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Update could not complete')
          console.log(action.payload);
          return;
        }
        // const { id } = action.payload;
        action.payload.date = new Date().toISOString();
        // const posts = state.posts.filter(post => post.id !== id);
        // use with adapter
        // state.posts = [...posts, action.payload];
        postsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Delete could not complete')
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        // const posts = state.posts.filter(post => post.id !== id);
        // state.posts = posts;
        // use the following with the adapter:
        postsAdapter.removeOne(state, id);
      })
  }
})


// getSelectors creates these selectors. We rename them with aliases using destructuring:
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts);

// export const selectAllPosts = (state) => state.posts.posts;   // clean code, in case of 
export const getPostsStatus = (state) => state.posts.status; 
export const getPostsError = (state) => state.posts.error; 
export const getCount = (state) => state.posts.count; 

// selector for getting post by postId
// export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId);

// note the arguments are dependencies, so renders will only change when they're changed
export const selectPostByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.userId === userId)
)

export const { increaseCount, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
