import React from 'react'
import './userinfo.css'
import { useUserStore } from '../../../lib/userstore'
import { useNavigate } from 'react-router-dom'
const UserInfo = () => {
  const {currentUser} = useUserStore()
  const navigate = useNavigate()
  const openVideoCall = () => {
    window.open("/videocall", "_blank"); // Opens /videocall in a new tab
  };
  return (
    <div className='userinfo'>
        <div className="user">
            <img src={currentUser.avatars || "./avatar.png"} alt="" />
            <h2>{currentUser.username}</h2>
        </div>
        <div className="icons">
            <img src="./more.png" alt="" />
            <img onClick={()=>openVideoCall()} src="./video.png" alt="" />
            <img src="./edit.png" alt="" />
        </div>
    </div>
  )
}

export default UserInfo