import './App.css';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom'
import Home from "./pages/Home"
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Registration from './pages/Registration';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import {AuthContext} from './helpers/AuthContext'
import axios from 'axios'
import React, {useState, useEffect} from 'react';
import Profile from './pages/Profile';


//import { response } from 'express';
function App() {
  const [authState, setAuthState] = useState({username: "", id:0, status: false})
  const [darkMode, setDarkMode] = useState(false)
 

 
  useEffect(() => {
    axios.get('http://localhost:3001/auth/auth', {headers: {
      accessToken: localStorage.getItem("accessToken")
    }}).then((response) =>{
      if(response.data.error){
        setAuthState({...authState, status: false})
      }
      else{
        setAuthState({
        username: response.data.username, id:response.data.id, status: true
        })
      }
    })
    
  
  
  },[])




  const logout = () => {
    localStorage.removeItem("accessToken")
    setAuthState({username: "", id:0, status: false})
  }

  return (
    <div className={`App ${darkMode ? "darkmode" : ""}` }>
      <AuthContext.Provider value={{authState, setAuthState}}>
      <Router>
        <nav className = "navbar">
        <div className = "navbar-brand"> <Link to='/'><img src="client\mysweat.png" alt='mySweat'/></Link></div>
        <div className ="navbar-menu">
      
        <Link to='/createpost'>CreatePost</Link>
        
        <div className='display-user'>
        {authState.status ? (
          <>
        <Link to={`/profile/${authState.id}`}>{authState.username}</Link>
        </>
        ) : (
          <Link to ='/login'></Link>
        )}
        </div>
       
        {!authState.status ? (
        <>
        
        <Link to='/login'>Login</Link>
        
        
        <Link to='/registration'>Registration</Link>
        </>
        ): (
          <div className='logout-button small-btn'>
          <button onClick={logout}> Logout </button>
          </div>
        )}

        
        </div>
        </nav>
        
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/createpost' element={<CreatePost />} />
          <Route path='/post/:id' element={<Post />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile/:id' element={<Profile/>} />
          
          <Route path='/*' element={<PageNotFound/>} />
          




        </Routes>
        </Router>
        </AuthContext.Provider>
    </div>
  );
}

export default App;
