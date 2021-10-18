import React from 'react'
import { FaUser } from 'react-icons/fa'
import { FaUnlock } from 'react-icons/fa'
import '../styles/style.css'

const submitHandler = (e: React.FormEvent<HTMLElement>) => {
  e.preventDefault()
}

export const Login = () => {
  return (
    <form onSubmit={submitHandler}>
      <div className='form-in'>
        <h1>Log In</h1>
        <div className='box'>
          <div className='user'>
            <FaUser />
            <input type='text' name='username' id='username' autoComplete='off' placeholder='Username/Email' />
            <br />
            <FaUnlock />
            <input type='password' name='password' id='password' autoComplete='off' placeholder='Password' />
          </div>
          {/* Error */}
          <p className='reset-password'>Forgot Password?</p>
          <div className='login-btn'>
            <button className='btn'>Login</button>
          </div>
        </div>
      </div>
    </form>
  )
}
