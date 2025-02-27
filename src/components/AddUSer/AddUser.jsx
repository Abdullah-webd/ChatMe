import React from 'react'
import './adduser.css'
import { useState } from 'react'
import { arrayUnion, collection, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { doc } from 'firebase/firestore'
import { useUserStore } from '../../lib/userstore'
const AddUser = () => {
  const [user, setUser] = useState(null)
  const {currentUser} = useUserStore()
    const handleSearch = async (e) =>{
      e.preventDefault();
      const formData = new FormData(e.target)
      const username = formData.get('username')
      try {
        const userRef = collection(db,'users')
        const q = query(userRef,where('username',"==",username))
        const querySnapShot = await getDocs(q)

        if(!querySnapShot.empty){
          setUser(querySnapShot.docs[0].data())
        }
      } catch (error) {
        console.log(error)
      }

    }

    const handleAdd = async ()=>{

      const chatRef = collection(db,'chats')
      const userChatsRef = collection(db,'userchats')
      try {
        const newChatRef = doc(chatRef)
        await setDoc(newChatRef,{
          createdAt:serverTimestamp(),
          messages:[],
        })

        await updateDoc(doc(userChatsRef,user.id),{
          chats:arrayUnion({
            chatId: newChatRef.id,
            lastMessage:'',
            recieverId:currentUser.id,
            updatedAt: Date.now()
          })
        })

        await updateDoc(doc(userChatsRef,currentUser.id),{
          chats:arrayUnion({
            chatId: newChatRef.id,
            lastMessage:'',
            recieverId:user.id,
            updatedAt: Date.now()
          })
        })

      } catch (error) {
        console.log(error)
      }
    }
  return (
    <div className='adduser'>
        <form onSubmit={(e)=>handleSearch(e)}>
            <input type="text" placeholder="username" name='username'/>
            <button>search</button>
        </form>
        {user && <div className='user'>
            <div className='detail'>
                <img src={user.avatars || "./avatar.png"} alt="" />
                <span>{user.username}</span>
            </div>
            <button onClick={()=>handleAdd()}>Add user</button>
        </div>}
    </div>
  )
}

export default AddUser