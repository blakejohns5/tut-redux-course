import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import axios from 'axios';


const initialState = {
  posts: [],
  status: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
} 

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


const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload)
      },
      prepare(title, content, userId) {
        
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(),
            userId,
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0
            },
          }
        }
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find(post => post.id === postId);
      if (existingPost) {
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
        // state.posts = state.posts.concat(loadedPosts);
        // note above did not work, sub with below:
        state.posts = loadedPosts;
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
        state.posts.push(action.payload)
      })
     
  }

})


export const selectAllPosts = (state) => state.posts.posts;   // clean code, in case of 
export const getPostsStatus = (state) => state.posts.status; 
export const getPostsError = (state) => state.posts.error; 

// selector for getting post by postId
export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
