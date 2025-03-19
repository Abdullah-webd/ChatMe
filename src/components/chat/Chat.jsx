import React from 'react'
import './chat.css'
import EmojiPicker from 'emoji-picker-react'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useChatStore } from '../../lib/chatstore'
import { useUserStore } from '../../lib/userstore'
import uploadImageAndGetURL from '../../lib/supabase'
import { FaArrowAltCircleLeft } from "react-icons/fa";




export const Chat = ({toggle}) => {
  
  const mess='hi'
  const [collapse, setCollapse] = useState(false)
  const [chat,setChat] = useState()
  const [open,setOpen] = useState(false)
  const [text,setText] = useState('')
  const [img,setImg] = useState({
    file:null,
    url:''
  })
  // const {currentUser} = useChatStore()
  const currentUser = useUserStore.getState().currentUser


  const handleImg = (e) => {
    if (e.target.files[0]){
        setImg({
            file: e.target.files[0],
            url:URL.createObjectURL(e.target.files[0])
        })
    }
    
}

  const {chatId,user,isCurrentUserBlocked,isRecieverBlocked} = useChatStore()


  useEffect(()=>{
    const unSub = onSnapshot(doc(db,'chats',chatId),(res)=>{
      setChat(res.data())

      return()=>{
        unSub()
      }
    })
    
  },[chatId])



  const handleEmoji = (e) => {
    setText((prev)=>prev + e.emoji)
    setOpen(false)
  }
  const handleSend = async ()=>{
    if (text === '') {
      return;
    }

    let imgUrl = null;

    try {
      
      if(img.file){
        imgUrl = await uploadImageAndGetURL(img.file)
      }
      await updateDoc(doc(db,'chats',chatId),{
        messages:arrayUnion({
          senderId:currentUser.id,
          text,
          createdAt: new Date(),
          ...imgUrl && {img: imgUrl}

        })
      })

      const userIDs = [currentUser.id,user.id];
      
      userIDs.forEach( async (id)=>{
        const userChatRef = doc(db,'userchats',id)
        const userChatsSnapshot = await getDoc(userChatRef)
  
        if(userChatsSnapshot.exists()){
          const userChatsData = userChatsSnapshot.data()
  
          const chatIndex = userChatsData.chats.findIndex(c=> c.chatId === chatId)
  
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now()
  
          await updateDoc(doc(db,'userchats',id),{
            chats:userChatsData.chats,
          })

          
        }
      })

      

    } catch (error) {
      console.log(error)
    }

    setImg({
      file:null,
      url:null
    })
    setText('')

  }
  const endRef = useRef(null)
  useEffect(()=>{
    endRef.current?.scrollIntoView({ behavior: "smooth" })
    
    
  },[])
  
  
  
  
  
  return (
    
      <div className='chat'>
        <div className="top">
          <div className="user">
            <img src={user?.avatars || "./avatar.png"} alt="" />
            <div className="texts">
              <span>{user?.username}</span>
              <p>Hey i'm using ChatMe
              </p>
            </div>
          </div>
          <div className="icons">
            <img src="./phone.png" alt="" />
            <img src="./video.png" alt="" />
            <div onClick={() => window.innerWidth <= 768 && toggle()}><FaArrowAltCircleLeft style={{fontSize:'15px',cursor:'pointer'}}  /></div>
            
          </div>
        </div>
        <div className="center">
          { chat?.messages.map((message)=>(
              <div className={message.senderId === currentUser?.id ? "message own" : 'message'} key={message?.createdAt}>
                <div className="texts">
                  {message.img && <img src={message.img} alt="" />}
                  <p>
                  {
                    message.text
                  }

                  </p>
                  {/* <span>{message.createdAt}</span> */}
                </div>
          
            </div>
          ))
          
          }
          {
            img.url && <div className='message own'>
                <div className='texts'>
                  <img src={img.url} alt="" />
                </div>
            </div>
          }
          <div ref={endRef}></div>
        </div>
        <div className="bottom">
          <div className="icons">
            <label htmlFor="file">
              <img src="./img.png" alt="" />
            </label>
            
            <input type="file" id='file' style={{display:'none'}} onChange={(e)=>handleImg(e)}/>
            <img className='cam' src="./camera.png" alt="" />
            <img className='mic' src="./mic.png" alt="" />
          </div>
          <input type="text" 
          value={text} placeholder={isCurrentUserBlocked ||isRecieverBlocked ? 'You cannot type a message':'Type a message...'}  onChange={(e)=>setText(e.target.value)} disabled={isCurrentUserBlocked || isRecieverBlocked}/>
          <div className='emoji'>
            <img src="./emoji.png" alt="" onClick={()=>setOpen((prev)=>!prev)}/>
            <div className="picker">
            <EmojiPicker open={open} onEmojiClick={(e)=>handleEmoji(e)}/>
            </div>
            
          </div>
          <button className='sendButton' onClick={()=>handleSend()} disabled={isCurrentUserBlocked || isRecieverBlocked}>Send</button>
        </div >
          
        
      </div>
  )
}

