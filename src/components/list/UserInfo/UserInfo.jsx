import React from 'react'
import './userinfo.css'
import { useUserStore } from '../../../lib/userstore'
const UserInfo = () => {
  const {currentUser} = useUserStore()
  return (
    <div className='userinfo'>
        <div className="user">
            <img src={currentUser.avatars || "./avatar.png"} alt="" />
            <h2>{currentUser.username}</h2>
        </div>
        <div className="icons">
            <img src="./more.png" alt="" />
            <img src="./video.png" alt="" />
            <img src="./edit.png" alt="" />
        </div>
    </div>
  )
}

export default UserInfo