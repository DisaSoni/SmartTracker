import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { BoardCard } from '../components'
import { deleteApi, get, post, put } from '../services/api'
import UserContext from '../UserContext';
import { isAdmin } from '../utils/helper';

const Boards = () => {
    const { user } = useContext(UserContext);

    const [boards, setBoards] = useState();
    const [showModal, setShowModal] = useState(false)
    const [isAddModal, setIsAddModal] = useState(true)
    const [board, setBoard] = useState('')
    const [boardDetails, setBoardDetails] = useState()

    const { state } = useLocation();

    const getBoards = async () => {
        try {
            const result = await get({ endpoint: `boards?workspace_id=${state?._id}` })
            if (result?.success) {
                if (!isAdmin(user?.type)) {
                    console.log('user >>>> ', user);
                    // const filteredData = result.data.filter(item => item?.users?.includes(user?._id));
                    const filteredData = result?.data.filter((item) => {
                        return item.users.some((user) => user._id === "6492e8845e6b7580e7ae8590");
                    });
                    setBoards(filteredData)
                    console.log('filteredData ', filteredData);
                }
                else {
                    setBoards(result?.data)
                }
            }
            console.log('getBoards ', JSON.stringify(result));
        } catch (error) {
            console.error('getBoards ', error);
        }
    }

    useEffect(() => {
        getBoards()
    }, [])

    const starBoard = async ({ board }) => {
        try {
            let body = {
                name: board?.name,
                is_starred: !board?.is_starred,
                workspace_id: board?.workspace_id
            }
            console.log('body ', body);
            const result = await put({ endpoint: `boards/update/${board?._id}`, body })
            if (result?.success) {
                getBoards()
            }
            console.log('starBoard ', result);
        } catch (error) {
            console.error('starBoard ', error);
        }
    }

    const addBoard = async () => {
        try {
            let body = {
                name: board,
                // is_starred: !board?.is_starred,
                workspace_id: state?._id
            }
            console.log('body ', body);
            const result = await post({ endpoint: `boards/add`, body })
            if (result?.success) {
                getBoards()
                setShowModal(false)
            }
            console.log('addBoard ', result);
        } catch (error) {
            console.error('addBoard ', error);
        }
    }

    const updateBoard = async () => {
        try {
            let body = {
                name: board,
                // is_starred: boardDetails?.is_starred,
                workspace_id: board?.workspace_id
            }
            console.log('body ', body);
            const result = await put({ endpoint: `boards/update/${boardDetails?._id}`, body })
            if (result?.success) {
                setShowModal(false)
                getBoards()
            }
            console.log('starBoard ', result);
        } catch (error) {
            console.error('starBoard ', error);
        }
    }

    const deleteBoard = async ({ _id }) => {
        try {
            const result = await deleteApi({ endpoint: `boards/delete/${_id}` })
            if (result?.success) {
                getBoards()
            }
            console.log('deleteBoard ', result);
        } catch (error) {
            console.error('deleteBoard ', error);
        }
    }

    return (
        <>

            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mt-5">
                        <li className="breadcrumb-item"><Link to="/" className='link'>Home</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{state?.name}</li>
                    </ol>
                </nav>

                <div className='d-flex align-items-center justify-content-between'>
                    <h1 className='my-5'>Boards</h1>
                    {isAdmin(user?.type) &&
                        <button className='btn btn-info' onClick={() => { setIsAddModal(true); setShowModal(true); }}>+ Add Board</button>}
                </div>

                <div className='row g-4'>
                    {boards && boards?.map((item) => {
                        return (
                            <div key={item?._id} className='col-md-4'>
                                <BoardCard board={item} setBoard={setBoard} starBoard={starBoard} setIsAddModal={setIsAddModal} setShowModal={setShowModal} setBoardDetails={setBoardDetails} deleteBoard={deleteBoard} />
                            </div>
                        )
                    })}
                </div>
            </div>


            <div className={`modal fade show`} id="exampleModalScrollable" tabIndex="-1" aria-labelledby="exampleModalScrollableTitle" aria-modal="true" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalScrollableTitle">{isAddModal ? 'Add' : 'Edit'}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <label htmlFor="board" className="form-label">Board</label>
                            <input type='text' id="board" value={board} onChange={(e) => setBoard(e.target.value)} className='form-control' />
                        </div>
                        <div className="modal-footer">
                            {isAddModal ?
                                <button type="button" className="btn btn-info" onClick={() => addBoard()}>Save changes</button>
                                :
                                <button type="button" className="btn btn-warning" onClick={() => updateBoard()}>Update</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Boards