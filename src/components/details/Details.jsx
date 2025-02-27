import React from 'react'
import './details.css'
import { auth, db } from '../../lib/firebase'
import { signOut } from 'firebase/auth'
import { useChatStore } from '../../lib/chatstore'
import { useUserStore } from '../../lib/userstore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
export const Details = () => {
  const {chatId,user,isCurrentUserBlocked,isRecieverBlocked,changeBlock} = useChatStore()
  const currentUser = useUserStore.getState().currentUser
  const handleBlock = async()=>{
    if(!user){
      return;
    }
    const userDocRef = doc(db,'users',currentUser.id)

    try {
      await updateDoc(userDocRef,{
        blocked: isRecieverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
      });
      changeBlock();
    } catch (error) {
      console.log(error)
    }


  }

  return (
    <div className='details'>
      <div className="user">
        <img src={user?.avatars|| "./avatar.png" }alt="" />
        <h2>{user?.username}</h2>
        <p>Hey i'm using ChatMe</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Setting</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>privacy & Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
        </div>
        <div className="photos">
          <div className="photoItem">
            <div className="photoDetail">
              <img src="./img8.webp" alt="" />
              <span>
                photo_2025_2.png
              </span>
            </div>
            <img src="./download.png" alt="" className='icon'/>
          </div>
          <div className="photoItem">
            <div className="photoDetail">
              <img src="./img8.webp" alt="" />
              <span>
                photo_2025_2.png
              </span>
            </div>
            <img src="./download.png" alt="" className='icon'/>
          </div>
          <div className="photoItem">
            <div className="photoDetail">
              <img src="./img8.webp" alt="" />
              <span>
                photo_2025_2.png
              </span>
            </div>
            <img src="./download.png" alt="" className='icon'/>
          </div>
          <div className="photoItem">
            <div className="photoDetail">
              <img src="./img8.webp" alt="" />
              <span>
                photo_2025_2.png
              </span>
            </div>
            <img src="./download.png" alt="" className='icon'/>
          </div>
          
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={()=>handleBlock()}>
          {isCurrentUserBlocked ? 'You are Blocked' : isRecieverBlocked ? 'User Blocked' : 'Block User'}
        </button>
        <button className='logout' onClick={()=>auth.signOut()}>Logout</button>
      </div>
    </div>
  )
}
