import { createSlice } from "@reduxjs/toolkit";
import { selectAllPosts } from "../posts/postsSlice";

const initialState = [
  { id: '0', name: 'Dude Lebowski' },
  { id: '1', name: 'Neil Young' },
  { id: '2', name: 'Stevie Nicks' },
]

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {

  }
})


export const selectAllUsers = (state) => state.users;

export default usersSlice.reducer;

