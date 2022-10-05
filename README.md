# Getting Started with Create React App

This workspace and notes were coded, following Dave Gray's tutorial:

[React Redux Full Course for Beginners | Redux Toolkit Complete Tutorial](https://www.youtube.com/watch?v=NqzdVN2tyvQ)

## Getting Started:

```
npm install @reduxjs/toolkit react-redux
```
- Add 'app' folder to src and create store.js file

### `What is Redux?`
Redux and redux store are synonymous, and stores the entire of the state of the app in an immutable object tree.

## Chapter 1: Redux Toolkit Intro

### Set up store
- Add basic setup to store.js, import *configureStore*
- In index.js, import store from store file, then import *Provider* from 'react-redux', add to jsx.

#### Create features directory in app and counter directory
- Counter will have a slice. Create the counterSlice for counter, add name, initial state, and reducer with actions.
- Be sure to export actions and full reducer (which the store will need).
- Create the Counter.js component. Import useSelector and useDispatch.
  - Declare variable for count using useSelector((state) => { state.counter.count }).
  - Return jsx with buttons that access increment and decrement from dispatch.

#### Add more actions to the reducer
- From counterSlice, add more actions.
- In this case, we add and incrementByAmount action and reset action.
- Then from Counter component, import and use useState() and variables to implement input and button for incrementByAmount and button for reset.
<br><br>

## Chapter 2: App Structures and Data Flow
<br>

### Create a slice and a component to show postson a bulletin board
<br>

`Initial state of app rolls back Counter function from Chapter 1`
- Create postsSlice.js, with initial state and basic reducer set up.
- Add the postsSlice to the store, to make sure it has access.
- Then create the PostsList component, using useSelector. However, accessing the state with dot notation isn't the best way.
  - It would be better to define the selection and create an export in the slice instead. That way if state changes shape in the future, code on't have to be changed in multiple places.
  Previous code in component:
  ```
  const posts = useSelector(state => state.posts); 
  ```
  New code in slice:
  ```
  export const selectAllPosts = (state) => state.posts;
  ```
  New code in component after import of selectAllPosts:
  ```
  const posts = useSelector(selectAllPosts);    
  ```
- Add component to App.js and open site with `npm run start`.

<br>

### Add to reducer in postsSlice, for adding new posts

- Remember to add to exports, see below. 
- When we write the reducer function, then createSlice automatically generates an action creator function with the same name. This is why we can then call action with the component name, postsSlice.actions, and that's what's exported in the end.
- Note 'state.push()': Normally state needs to be treated by using spread operator with state and then adding action payload, but React Toolkit uses ImmerJs under the hood, allowing to use state.push, without mutating the state.
<br>

```
 reducers: {
    postAdded(state, action) {
      state.push(action.payload)
    }
...
export const { postAdded } = postsSlice.actions;
```
### Add a form for inputting new posts

- Create a component for our form in features: AddPostForm.js
- In this case, adapted and used `react-hook-form` package.
- Set states that are only needed in component, title and content, with useState().

  *Next...*

- Import useDispatch, nanoid, and postAdded in AddPostForm.js
- Get dispatch from useDispatch.
- Complete the function for onSavePostClicked, checking first if title and content exist, then calling dispatch on postAdded reducer, which takes an object with the id, title, and content.
- Then set local state back to empty strings.
```
const onSavePostClicked = (data) => {
    console.log(data)
    const { title, content } = data;

    if (title && content) {
      dispatch(
        postAdded({
          id: nanoid(),
          title,
          content,
        })
      )
      setTitle('');
      setContent('');
    }
  }
```
Additionally, we can abstract some of this to the slice by using a `prepare callback`, which can:
  - generate unique ids
  - format the data
  - return the object with the payload
This will simplify our component.


In the slice, we can adjust the code for postAdded.
This way, our postAdded reducer fucntion has a reducer and a prepare callback, which returns the payload in the format needed:
```
...
reducers: {
    postAdded: {
      reducer(state, action) {
        state.push(action.payload)
      },
      prepare(title, content) {
        return {
          payload: {
            id: nanoid(),
            title,
            content
          }
        }
      }
    }
  }
...
```
Then in AddPostForm, we can simplify the code. The rest will be handled in our `prepare callback` function. The benefit is our component doesn't have to know the structure of the statement, which will be handled by the slice.

New code in AddPostForm looks like this:
```
  const onSavePostClicked = (data) => {
    console.log(data)
    const { title, content } = data;

    if (title && content) {
      dispatch(
        postAdded(title, content)
      )
      setTitle('');
      setContent('');
    }
  }
```

### Users: repeat redux app structures and data flow to deal with users
<br>

- Add new folder 'users' in 'features'.
- Create usersSlice in 'users' folder.
- Add slice to store:
  ```
  export const store = configureStore({
    reducer: {
      posts: postsReducer,
      users: usersReducer,
    }
  })
  ```
  - Go back to postsSlice, and add userId as an argument to the prepare callback.
  New prepare callback in postsSlice:
  ```
   prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            userId,
          }
        }
      }
  ```





## Glossary:

`slice`: a collection of reducer logic and actions for a single feature in an app

`prepare callback`:
