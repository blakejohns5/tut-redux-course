import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { increaseCount, getCount } from '../features/posts/postsSlice';

const Header = () => {
  const dispatch = useDispatch();
  const count = useSelector(getCount);


  return (
    <header className='header'>
      <h1>Redux Blog</h1>
      <nav className='nav__list'>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="post">Post</Link></li>
          <li><Link to="user">Users</Link></li>
        </ul>
        <button onClick={() => dispatch(increaseCount())}>{count}</button>
      </nav>
    </header>
    
  )
}

export default Header