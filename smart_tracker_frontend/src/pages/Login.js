import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { post } from '../services/api';
import UserContext from '../UserContext';
import { isEmail } from '../utils/helper';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [error, setError] = useState();

  const login = async () => {
    try {
      setError();
      if (!email || !password) {
        setError('Email and password are required')
        return
      }
      if (!isEmail(email)) {
        setError('Incorrect email')
        return
      }
      let body = {
        email,
        password,
      }
      const result = await post({ endpoint: 'users/login', body })
      console.log('result ', result);
      
      if (result?.success) {
        setUser(result?.user);
        navigate('/')
      }
      else {
        setError(result?.message);
      }
    } catch (error) {
      console.error('login ', error);
    }
  }

  return (
    <div className='container-fluid' id='loginPage'>
      <div className='row'>
        <div className='d-none d-md-flex col-md-6 left-part'>
          <img src='./smart-tracker.png' className='logo' />
        </div>
        <div className='col-md-6 right-part'>
          <div className='card auth-card'>
            <h2>Welcome!</h2>
            {error && <div className="alert alert-danger p-2" role="alert">
              {error}
            </div>}
            <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}  className='form-control mt-4' />
            <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}  className='form-control mt-3' />
            <div className='mt-3 d-flex justify-content-between'>
              <span>Don't have an account yet?</span>
              <Link to='/register' className='link'>Sign up!</Link>
            </div>
            <button onClick={login} className='btn btn-info mt-4'>Sign in</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login