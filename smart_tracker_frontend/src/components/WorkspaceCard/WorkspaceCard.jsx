import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import UserContext from '../../UserContext';
import { isAdmin } from '../../utils/helper';
import './styles.css';

const WorkspaceCard = ({ workspace, handleEdit, deleteWorkspace }) => {
    const { user } = useContext(UserContext);

    const { _id, name } = workspace;
    const navigate = useNavigate();

    return (
        <div className={`card board-card p-4`} >
            <h5 className="text-light" onClick={() =>
                navigate('/boards', {
                    state: {
                        _id,
                        name
                    }
                })}>{name}</h5>
            {isAdmin(user?.type) &&
                <div>
                    <img src='./edit.png' className='view-icon mx-2' onClick={() => handleEdit({ workspace })} />
                    <img src='./trash.png' className='trash-icon' onClick={() => deleteWorkspace({ _id })} />
                </div>}
        </div>
    )
}

export default WorkspaceCard