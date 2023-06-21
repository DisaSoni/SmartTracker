import React, { useContext, useEffect, useState } from 'react'
import { put } from '../services/api';
import UserContext from '../UserContext';

const Profile = () => {
    const { user, setUser } = useContext(UserContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('');

    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    const updateUser = async () => {
        try {
            setError();
            if (!name) {
                setError('Name is required')
                return
            }
            let body = {
                name
            }
            const result = await put({ endpoint: `users/update/${user?._id}`, body })
            if (result?.success) {
                setUser(result?.data)
                setSuccess('User updated successfully!');
            }
            else {
                setError(result?.message);
            }
            console.log('result ', result);
        } catch (error) {
            console.error('updateUser ', error);
        }
    }

    useEffect(() => {
        console.log('user > ', user);
        setName(user?.name)
        setEmail(user?.email)
        setPassword(user?.password)
        setType(user?.type)
    },[user])

    console.log('name ', name);

    return (
        <div className='container my-5'>
            <div className='profile-form'>
                <h2>Profile</h2>
                {success && <div className="alert alert-success p-2" role="alert">
                    {success}
                </div>}
                {error && <div className="alert alert-danger p-2" role="alert">
                    {error}
                </div>}
                <input type='text' placeholder='Name*' value={name} onChange={(e) => setName(e.target.value)} className='form-control mt-4' />
                <input type='email' placeholder='Email*' value={email} className='form-control mt-3' disabled/>
                <input type='password' placeholder='Password*' value={password} className='form-control mt-3' disabled/>
                <select className="form-select mt-3" aria-label="example" value={type} disabled>
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                    <option value="viewer">Viewer</option>
                </select>
                <button onClick={updateUser} className='btn btn-info mt-4'>Update</button>
            </div>
        </div>
    )
}

export default Profile