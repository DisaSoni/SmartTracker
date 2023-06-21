import React, { useContext, useEffect, useState } from 'react'
import { WorkspaceCard } from '../components';
import { deleteApi, get, post, put } from '../services/api'
import UserContext from '../UserContext';
import { isAdmin } from '../utils/helper';

const Home = () => {
  const { user } = useContext(UserContext);

  const [workspaces, setWorkspaces] = useState();
  const [showModal, setShowModal] = useState(false)
  const [isAddModal, setIsAddModal] = useState(true)
  const [workspace, setWorkspace] = useState('')
  const [workspaceDetails, setWorkspaceDetails] = useState()

  const getWorkspaces = async () => {
    try {
      const result = await get({ endpoint: 'workspaces' })
      if (result?.success) {
        setWorkspaces(result?.data)
      }
      console.log('getWorkspaces ', result);
    } catch (error) {
      console.error('getWorkspaces ', error);
    }
  }

  useEffect(() => {
    getWorkspaces()
  }, [])

  const addWorkspace = async () => {
    try {
      let body = {
        name: workspace
      }
      console.log('body ', body);
      const result = await post({ endpoint: `workspaces/add`, body })
      if (result?.success) {
        getWorkspaces()
        setShowModal(false)
      }
      console.log('addWorkspace ', result);
    } catch (error) {
      console.error('addWorkspace ', error);
    }
  }

  const updateWorkspace = async () => {
    try {
      let body = {
        name: workspace
      }
      console.log('body ', body);
      const result = await put({ endpoint: `workspaces/update/${workspaceDetails?._id}`, body })
      if (result?.success) {
        setShowModal(false)
        getWorkspaces()
      }
      console.log('updateWorkspace ', result);
    } catch (error) {
      console.error('updateWorkspace ', error);
    }
  }

  const deleteWorkspace = async ({ _id }) => {
    try {
      const result = await deleteApi({ endpoint: `workspaces/delete/${_id}` })
      if (result?.success) {
        getWorkspaces()
      }
      console.log('deleteWorkspace ', result);
    } catch (error) {
      console.error('deleteWorkspace ', error);
    }
  }

  const handleEdit = ({ workspace }) => {
    setWorkspace(workspace?.name);
    setWorkspaceDetails(workspace);
    setIsAddModal(false);
    setShowModal(true)
  }

  return (
    <>
      <div className='container'>
        <div className='d-flex align-items-center justify-content-between'>
          <h1 className='my-5'>Workspaces</h1>
          {isAdmin(user?.type) &&
            <button className='btn btn-info' onClick={() => { setIsAddModal(true); setShowModal(true); }}>+ Add Workspace</button>}
        </div>

        <div className='row g-4'>
          {workspaces && workspaces.map((item) => {
            return (
              <div key={item?._id} className='col-md-4'>
                <WorkspaceCard workspace={item} handleEdit={handleEdit} deleteWorkspace={deleteWorkspace} />
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
              <label htmlFor="board" className="form-label">workspace</label>
              <input type='text' id="workspace" value={workspace} onChange={(e) => setWorkspace(e.target.value)} className='form-control' />
            </div>
            <div className="modal-footer">
              {isAddModal ?
                <button type="button" className="btn btn-info" onClick={() => addWorkspace()}>Save changes</button>
                :
                <button type="button" className="btn btn-warning" onClick={() => updateWorkspace()}>Update</button>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home