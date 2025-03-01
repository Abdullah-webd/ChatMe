import React from 'react'
import './list.css'
import UserInfo from './UserInfo/UserInfo'
import ChatList from './ChatList/ChatList'


export const List = ({toggle}) => {
  return (
    <div className='list' >
      <div>
        <UserInfo/>
      </div>
      <div >
        <ChatList toggle = {toggle}/>
      </div>     
    </div>
  )
}
