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



## Glossary:

`slice:` a collection of reducer logic and actions for a single feature in an app
