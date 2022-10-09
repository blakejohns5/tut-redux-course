import './App.css';
import AddPostForm from './features/posts/AddPostForm';
import PostsList from './features/posts/PostsList';
import SinglePostPage from './features/posts/SinglePostPage';
import EditPostForm from './features/posts/EditPostForm'
import Layout from './components/Layout';
import UsersList from './features/users/UsersList';
import UserPage from './features/users/UserPage';
import { Routes, Route, Navigate } from 'react-router-dom';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        
        <Route index element={<PostsList />} />

        <Route path="post">
          <Route index element={<AddPostForm  />} />
          <Route path=":postId" element={<SinglePostPage />} />
          <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>

        <Route path="user">
          <Route index element={<UsersList  />} />
          <Route path=":userId" element={<UserPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes> 
  );
}

export default App;
