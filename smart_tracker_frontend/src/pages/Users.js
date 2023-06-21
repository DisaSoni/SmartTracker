import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { get, put } from '../services/api'

const Users = () => {
    const [users, setUsers] = useState();
    const [board, setBoard] = useState();

    const { state } = useLocation();

    const getUsers = async () => {
        try {
            const result = await get({ endpoint: `users` })
            if (result?.success) {
                console.log('board ', JSON.stringify(board));
                console.log('board?.users ', board?.users);
                // let userArr = result?.data.filter((user) => !board?.users.some(buser => buser._id === user?._id))
                const filteredUsers = result?.data.filter(user => !board.users.some(boardUser => boardUser._id === user._id));
                setUsers(filteredUsers)
            }
            console.log('getUsers ', JSON.stringify(result?.data));
        } catch (error) {
            console.error('getUsers ', error);
        }
    }

    useEffect(() => {
        setBoard(state?.board)
    }, [])

    useEffect(() => {
        if (board) {
            getUsers()
        }
    }, [board])

    const addUser = async ({ user_id }) => {
        try {
            let body = {
                name: board?.name,
                is_starred: !board?.is_starred,
                workspace_id: board?.workspace_id,
                users: [...board?.users, user_id]
            }
            console.log('body ', body);
            const result = await put({ endpoint: `boards/update/${board?._id}`, body })
            if (result?.success) {
                setBoard(result?.data)
                getUsers()
            }
            console.log('addUser ', result);
        } catch (error) {
            console.error('addUser ', error);
        }
    }

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-5">
                    <li className="breadcrumb-item"><Link to="/" className='link'>Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{board?.name}</li>
                </ol>
            </nav>

            <h1 className='my-5'>Users</h1>

            <div className='table-responsive'>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Type</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users?.map((item, index) => {
                            return (
                                <tr key={item?._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{item?.name}</td>
                                    <td>{item?.email}</td>
                                    <td>{item?.type}</td>
                                    <td><button className='btn btn-outline-secondary' onClick={() => addUser({ user_id: item?._id })}>Add</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Users