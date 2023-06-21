import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { post } from '../services/api'
import { isEmail } from '../utils/helper';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('');

    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    const createUser = async () => {
        try {
            setError();
            if(!name || !email || !password || !type){
                setError('Name, email, password and type are required')
                return
            }
            if (!isEmail(email)) {
                setError('Incorrect email')
                return
            }
            let body = {
                name,
                email,
                password,
                type
            }
            const result = await post({ endpoint: 'users/add', body })
            if (result?.success) {
                setSuccess('User registered successfully!');
            }
            else {
                setError(result?.message);
            }
        } catch (error) {
            console.error('createUser ', error);
        }
    }
    
    return (
        <div className='container-fluid' id='loginPage'>
            <div className='row'>
                <div className='d-none d-md-flex col-md-6 left-part'>
                    <img src='./smart-tracker.png' className='logo' />
                </div>
                <div className='col-md-6 right-part'>
                    <div className='card auth-card p-5'>
                        <h2>Welcome aboard!</h2>
                        {success && <div className="alert alert-success p-2" role="alert">
                            {success}
                        </div>}
                        {error && <div className="alert alert-danger p-2" role="alert">
                            {error}
                        </div>}
                        <input type='text' placeholder='Name*' value={name} onChange={(e) => setName(e.target.value)} className='form-control mt-4' />
                        <input type='email' placeholder='Email*' value={email} onChange={(e) => setEmail(e.target.value)} className='form-control mt-3' />
                        <input type='password' placeholder='Password*' value={password} onChange={(e) => setPassword(e.target.value)} className='form-control mt-3' />
                        <select className="form-select mt-3" aria-label="example" value={type} onChange={(e) => setType(e.target.value)}>
                            <option defaultValue="">Select User...*</option>
                            <option value="admin">Admin</option>
                            <option value="member">Member</option>
                            <option value="viewer">Viewer</option>
                        </select>

                        <div className='mt-3 d-flex justify-content-between'>
                            <span>Already have an account?</span>
                            <Link to='/login' className='link'>Sign in!</Link>
                        </div>
                        <button onClick={createUser} className='btn btn-info mt-4'>Sign up</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Register