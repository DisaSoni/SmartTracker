import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import UserContext from '../../UserContext';
import { isAdmin } from '../../utils/helper';
import './styles.css';

const BoardCard = ({ board, starBoard, setBoard, setBoardDetails, setShowModal, setIsAddModal, deleteBoard }) => {
    const { user } = useContext(UserContext);

    const { name, is_starred } = board;
    const navigate = useNavigate();

    return (
        <div className={`card board-card p-4`}
        >
            <h5 className="text-light" onClick={() =>
                navigate('/board', {
                    state: {
                        board
                    }
                })
            }>{name}</h5>
            <div>

                {is_starred ?
                    <img src='./star.png' className='img-star' onClick={() => starBoard({ board })} />
                    :
                    <img src='./starEmpty.png' className='img-star empty' onClick={() => starBoard({ board })} />}
                {isAdmin(user?.type) &&
                    <>
                        <img src='./edit.png' className='view-icon mx-2' onClick={() => { setBoard(name); setBoardDetails(board); setIsAddModal(false); setShowModal(true) }} />
                        <img src='./trash.png' className='trash-icon' onClick={() => deleteBoard({ _id: board?._id })} />
                    </>}
            </div>
        </div>
    )
}

export default BoardCard