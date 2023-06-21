import React, { useEffect, useState } from 'react'
import { get, post, put } from '../../services/api'
import './styles.css'

const BugDetail = ({ bug, showModal = false, setShowModal }) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState()

    const [comments, setComments] = useState()
    const [comment, setComment] = useState('')

    const [commentDetails, setCommentDetails] = useState()

    const getComments = async () => {
        try {
            const result = await get({ endpoint: `comments?bug_id=${bug?._id}` })
            if (result?.success) {
                setComments(result?.data)
            }
            console.log('getComments ', result);
        } catch (error) {
            console.error('getComments ', error);
        }
    }

    useEffect(() => {
        console.log('bug ', bug);
        if (bug) {
            setTitle(bug?.title || '')
            setDescription(bug?.description || '')
            setPriority(bug?.priority || '')

            // Fetch all comments
            getComments()
        }
    }, [bug])

    const updateBug = async ({ id }) => {
        try {
            const body = {
                title,
                description,
                priority
            }

            const result = await put({ endpoint: `bugs/update/${id}`, body });

            if (result?.success) {
                setShowModal(false)
            }

            console.log('updateBug ', result);
        } catch (error) {
            console.error('updateBug ', error);
        }
    };

    const addComment = async () => {
        try {
            let body = {
                description: comment,
                bug_id: bug?._id,
                user_id: "648f9c18e1e1201b720e6c8c"
            }

            if (!!commentDetails) {
                body = { ...body, parent_comment_id: commentDetails?._id, is_reply: true }
            }

            const result = await post({ endpoint: `comments/add`, body });

            if (result?.success) {
                setComment('')
                setCommentDetails()
                getComments()
            }

            console.log('addComment ', result);
        } catch (error) {
            console.error('addComment ', error);
        }
    };

    const printTime = ({ date }) => {
        if (new Date(date).toDateString() === new Date().toDateString()) {
            return new Date(date).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })
        }
        return new Date(date).toLocaleDateString()
    }

    return (
        <div className={`modal fade show ${showModal && 'd-block'}`} id="exampleModalScrollable" tabIndex="-1" aria-labelledby="exampleModalScrollableTitle" aria-modal="true" role="dialog">
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalScrollableTitle">Edit</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
                    </div>
                    <div className="modal-body">
                        <div className='row'>
                            <div className='col-md-7'>
                                <label htmlFor="title" className="form-label">Title</label>
                                <input type='text' id="title" value={title} onChange={(e) => setTitle(e.target.value)} className='form-control' />
                                <label htmlFor="description" className="form-label mt-3">Description</label>
                                <textarea type='text' rows={7} id="description" value={description} onChange={(e) => setDescription(e.target.value)} className='form-control' />
                                <label htmlFor="priority" className="form-label mt-3">Priority</label>
                                <select className="form-select" aria-label="example" value={priority} onChange={(e) => setPriority(e.target.value)}>
                                    <option value="normal">Normal</option>
                                    <option value="moderate">Moderate</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <div className='col-md-5'>

                                <div className='d-flex flex-column justify-content-between h-100'>
                                    <div>
                                        Comments
                                        <div className='card p-2'>
                                            {comments && comments.map((item) => (
                                                <div key={item?._id}>
                                                    <div className='d-flex flex-column'>
                                                        <div className='d-flex justify-content-between'>
                                                            <span>
                                                                {item?.description}
                                                            </span>
                                                            <span className='time'>{printTime({ date: item?.createdAt })}</span>
                                                        </div>
                                                        <em>By {item?.user_id?.name}</em>
                                                        <span className='reply' onClick={() => setCommentDetails(item)}>Reply</span>
                                                    </div>
                                                    {item?.childComments?.map((childComment) => (
                                                        <div key={childComment?._id} className='d-flex flex-column ms-3'>
                                                            <div className='d-flex justify-content-between'>
                                                                <span>
                                                                    {childComment?.description}
                                                                </span>
                                                                <span className='time'>{printTime({ date: childComment?.createdAt })}</span>
                                                            </div>
                                                            <em>By {childComment?.user_id?.name}</em>
                                                        </div>
                                                    ))}
                                                    <hr className='divider' />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {commentDetails &&
                                        <div className='alert alert-secondary mt-3 d-flex justify-content-between'>
                                            <div>
                                                <span className='reply-comment'>Reply</span><br />
                                                <span className='reply-comment'>{commentDetails?.description}</span>
                                            </div>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setCommentDetails()}></button>
                                        </div>}
                                    <div className="input-group">
                                        <input type="text" className="form-control" placeholder="Comment here" value={comment} onChange={(e) => setComment(e.target.value)} />
                                        <div className="input-group-append">
                                            <button className="btn btn-secondary" type="button" onClick={addComment}>Send</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-info" onClick={() => updateBug({ id: bug?._id })}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BugDetail