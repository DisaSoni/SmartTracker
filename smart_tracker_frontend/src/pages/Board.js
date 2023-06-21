import React, { useContext, useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BugDetail } from '../components'
import BugCard from '../components/BugCard/BugCard'
import { deleteApi, get, post, put } from '../services/api'
import UserContext from '../UserContext'
import { isAdmin, isViewer } from '../utils/helper'

const Board = () => {
    const { user } = useContext(UserContext);

    const navigate = useNavigate();
    const { state } = useLocation();

    const [bug, setBug] = useState()
    const [showModal, setShowModal] = useState(false)

    const [boardUsers, setBoardUsers] = useState()

    // Add bug modal
    const [showAddBugModal, setShowAddBugModal] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState()
    const [listId, setListId] = useState()

    // Add list modal
    const [showAddListModal, setShowAddListModal] = useState(false)
    const [isShowAddListModal, setIsShowAddListModal] = useState(false)
    const [name, setName] = useState('')
    const [listDetails, setListDetails] = useState()


    // Get list with bugs and sort by sequence
    const getLists = async () => {
        try {
            console.log('state ', state);
            const result = await get({ endpoint: `lists/getListsWithBugs/${state?.board?._id}` })
            if (result?.success) {
                const sortedLists = result.lists.sort((a, b) => a.sequence - b.sequence);
                const updatedLists = sortedLists.map(list => {
                    const sortedBugs = list.bugs.sort((a, b) => a.sequence - b.sequence);
                    return { ...list, bugs: sortedBugs };
                });

                setData(updatedLists)
            }
            console.log('getLists ', result);
        } catch (error) {
            console.error('getLists ', error);
        }
    }

    // Updates multiple bugs sequence that is changed
    const updateBugs = async ({ bugIds, destinationSectionId }) => {
        try {
            const updatedBugs = bugIds.map((id, index) => ({
                id,
                sequence: index + 1,
                list_id: destinationSectionId
            }));
            const result = await put({ endpoint: 'bugs/updateBatch', body: { bugs: updatedBugs } });
            if (result?.success) {
                // getLists()
            }
            console.log('updateBug ', result);
        } catch (error) {
            console.error('updateBug ', error);
        }
    };

    useEffect(() => {
        getLists()

        setBoardUsers(state?.board?.users)
    }, [])

    const [data, setData] = useState()

    // Move bug from one place to another and call api to update its sequence and list_id
    const onDragEnd = result => {
        if (!result?.destination || isViewer(user?.type)) return;
        const { source, destination } = result;

        const sourceColIndex = data.findIndex((e) => e._id === source.droppableId);
        const sourceCol = data[sourceColIndex];
        const sourceTask = [...sourceCol.bugs];
        const [movedItem] = sourceTask.splice(source.index, 1);

        if (source.droppableId !== destination.droppableId) {
            const destinationColIndex = data.findIndex((e) => e._id === destination.droppableId);
            const destinationCol = data[destinationColIndex];
            const destinationTask = [...destinationCol.bugs];

            const existingItemIndex = destinationTask.findIndex((item) => item._id === movedItem._id);

            if (existingItemIndex !== -1) {
                destinationTask.splice(existingItemIndex, 1);
            }

            destinationTask.splice(destination.index, 0, movedItem);

            data[sourceColIndex].bugs = sourceTask;
            data[destinationColIndex].bugs = destinationTask;

            console.log('Moved item from section:', sourceCol.name);
            console.log('Moved item:', movedItem);
            console.log('Destination section:', destinationCol.name);
            console.log('Destination index:', destination.index);
            console.log('Destination section ID:', destination.droppableId);

            const affectedBugIds = destinationTask.map((bug) => bug._id);
            updateBugs({ bugIds: affectedBugIds, destinationSectionId: destination.droppableId });
        } else {
            sourceTask.splice(destination.index, 0, movedItem);

            data[sourceColIndex].bugs = sourceTask;

            console.log('Moved item within section:', sourceCol.name);
            console.log('Moved item:', movedItem);
            console.log('Destination index:', destination.index);
            console.log('Destination section ID:', destination.droppableId);

            const affectedBugIds = sourceTask.map((bug) => bug._id);
            updateBugs({ bugIds: affectedBugIds, destinationSectionId: destination.droppableId });
        }

        setData(data);
    }

    // This function set bug data to make it accessible inside modal, and opens modal
    const openBugDetailModal = (bug) => {
        setBug(bug)
        setShowModal(true)
    }

    const addBug = async () => {
        try {
            let body = {
                title,
                description,
                priority,
                list_id: listId,
                user_id: "646c1d3118fc24e6a3d68caa"
            }
            console.log('body ', body);
            const result = await post({ endpoint: `bugs/add`, body })
            if (result?.success) {
                getLists()
                setShowAddBugModal(false)
                setTitle(''); 
                setDescription(''); 
                setPriority('')
            }
            console.log('addBug ', result);
        } catch (error) {
            console.error('addBug ', error);
        }
    }

    const deleteBug = async ({ _id }) => {
        try {
            const result = await deleteApi({ endpoint: `bugs/delete/${_id}` })
            if (result?.success) {
                getLists()
            }
            console.log('deleteBug ', result);
        } catch (error) {
            console.error('deleteBug ', error);
        }
    }

    const addList = async () => {
        try {
            let body = {
                name,
                board_id: state?.board?._id,
            }
            console.log('body ', body);
            const result = await post({ endpoint: `lists/add`, body })
            if (result?.success) {
                getLists()
                setShowAddListModal(false)
                setName('')
            }
            console.log('addList ', result);
        } catch (error) {
            console.error('addList ', error);
        }
    }

    const updateList = async () => {
        try {
            let body = {
                name
            }
            const result = await put({ endpoint: `lists/update/${listDetails?._id}`, body })
            if (result?.success) {
                getLists()
                setShowAddListModal(false)
                setName('')
            }
            console.log('addList ', result);
        } catch (error) {
            console.error('addList ', error);
        }
    }

    const deleteList = async ({ _id }) => {
        try {
            const result = await deleteApi({ endpoint: `lists/delete/${_id}` })
            if (result?.success) {
                getLists()
            }
            console.log('deleteList ', result);
        } catch (error) {
            console.error('deleteList ', error);
        }
    }

    const removeUserFromBoard = async ({ user_id }) => {
        try {
            const updatedUserArr = boardUsers.filter((boardUser) => boardUser?._id !== user_id)
            let body = {
                name: state?.board?.name,
                users: updatedUserArr
            }
            console.log('body ', body);
            const result = await put({ endpoint: `boards/update/${state?.board?._id}`, body })
            if (result?.success) {
                setBoardUsers(result?.data?.users)
            }
            console.log('removeUserFromBoard ', result);
        } catch (error) {
            console.error('removeUserFromBoard ', error);
        }
    }

    return (
        <>
            <div className='my-5'>
                <div className='d-flex align-items-center justify-content-between'>
                    <h1 className='mx-5'>{state?.board?.name}</h1>
                    <div className='me-5 d-flex'>
                        {!isViewer(user?.type) && <button className='btn btn-info' onClick={() => { setIsShowAddListModal(true); setShowAddListModal(true) }}>+ Add List</button>}
                        <div className="dropdown ms-2">
                            <button className="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Users
                            </button>
                            <ul className="dropdown-menu">
                                {boardUsers?.map((item) => (
                                    <li>
                                        <div className='dropdown-item d-flex justify-content-between'>
                                            {item?.name}
                                            {isAdmin(user?.type) && <img src='./trash.png' className='trash-icon' onClick={() => removeUserFromBoard({ user_id: item?._id })} />}
                                        </div>
                                    </li>
                                ))}
                                {isAdmin(user?.type) && <li>
                                    <div className='text-center'>
                                        <button className='btn btn-primary' onClick={() => navigate('/users', { state: { board: state?.board } })}> + Add</button>
                                    </div>
                                </li>}
                            </ul>
                        </div>
                    </div>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="boards-wrapper p-4">
                        {
                            data && data.map(section => {
                                console.log('section ', section);
                                return (
                                    <Droppable
                                        key={section._id}
                                        droppableId={section._id}
                                    >
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                className='bug-group p-4 mx-4'
                                                ref={provided.innerRef}
                                            >
                                                <div className="section-title d-flex align-items-center justify-content-between">
                                                    {section?.name}
                                                    {!isViewer(user?.type) && <div>
                                                        <img src='./edit.png' className='view-icon mx-2' onClick={() => { setName(section?.name); setListDetails(section); setIsShowAddListModal(false); setShowAddListModal(true) }} />
                                                        <img src='./trash.png' className='trash-icon' onClick={() => deleteList({ _id: section?._id })} />
                                                    </div>}
                                                </div>
                                                <div className="bug-card-container">
                                                    {section?.bugs &&
                                                        section.bugs.map((bug, index) => (
                                                            <Draggable
                                                                key={bug._id}
                                                                draggableId={bug._id}
                                                                index={index}
                                                            >
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={{
                                                                            ...provided.draggableProps.style,
                                                                            opacity: snapshot.isDragging ? 0.5 : 1,
                                                                        }}
                                                                    >
                                                                        <BugCard bug={bug} openBugDetailModal={openBugDetailModal} deleteBug={deleteBug}>
                                                                            {bug.title}
                                                                        </BugCard>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))
                                                    }
                                                    {provided.placeholder}
                                                    {!isViewer(user?.type) && <button className='btn btn-outline-secondary form-control' onClick={() => { setListId(section._id); setShowAddBugModal(true) }}>+ Add Bug</button>}
                                                </div>
                                            </div>
                                        )}
                                    </Droppable>
                                )
                            }
                            )
                        }
                    </div>
                </DragDropContext>
            </div>
            <BugDetail showModal={showModal} bug={bug} setShowModal={setShowModal} />

            {/* Add Bug Modal */}
            <div className={`modal fade show`} id="exampleModalScrollable" tabIndex="-1" aria-labelledby="exampleModalScrollableTitle" aria-modal="true" role="dialog" style={{ display: showAddBugModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalScrollableTitle">Add</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setShowAddBugModal(false); setTitle(''); setDescription(''); setPriority('') }}></button>
                        </div>
                        <div className="modal-body">
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
                        <div className="modal-footer">
                            <button type="button" className="btn btn-info" onClick={() => addBug()}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add List Modal */}
            <div className={`modal fade show`} id="exampleModalScrollable" tabIndex="-1" aria-labelledby="exampleModalScrollableTitle" aria-modal="true" role="dialog" style={{ display: showAddListModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalScrollableTitle">{isShowAddListModal ? 'Add' : 'Edit'}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setShowAddListModal(false); setName('') }}></button>
                        </div>
                        <div className="modal-body">
                            <label htmlFor="name" className="form-label">name</label>
                            <input type='text' id="name" value={name} onChange={(e) => setName(e.target.value)} className='form-control' />
                        </div>
                        <div className="modal-footer">
                            {isShowAddListModal ?
                                <button type="button" className="btn btn-info" onClick={() => addList()}>Save changes</button>
                                :
                                <button type="button" className="btn btn-info" onClick={() => updateList()}>Update</button>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Board