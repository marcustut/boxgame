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
            <div className='field'>
              <FaUser />
              <input type='text' autoComplete='off' placeholder=' ' />
              <label htmlFor='email' className='label'>
                Username/Email
              </label>
            </div>
            <div className='field'>
              <FaUnlock />
              <input type='password' autoComplete='off' placeholder=' ' />
              <label htmlFor='password' className='label'>
                Password
              </label>
            </div>
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
