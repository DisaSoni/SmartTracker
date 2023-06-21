import React, { useContext } from 'react'
import UserContext from '../../UserContext';
import { isViewer } from '../../utils/helper'
import './styles.css'

const BugCard = (props) => {
    const { user } = useContext(UserContext);

    const { bug, openBugDetailModal, deleteBug } = props

    return (
        <div className='bug-card mb-3 p-3 d-flex justify-content-between'>
            {props.children}
            {!isViewer(user?.type) &&<div>
                <img src='./view.png' className='view-icon me-2' onClick={() => openBugDetailModal(bug)} />
                <img src='./trash.png' className='trash-icon' onClick={() => deleteBug({ _id: bug?._id })} />
            </div>}
        </div>
    )
}

export default BugCard