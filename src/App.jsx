import { List } from "./components/list/list"
import Chat from "./components/chat/Chat"
import { Details } from "./components/details/Details"
import { useEffect } from "react"
import Login from "./components/Login/Login"
import Notification from "./components/Notification/notification"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase"
import { useUserStore } from "./lib/userstore"
import { useChatStore } from "./lib/chatstore"
const App = () => {
  const user = false
  const {chatId} = useChatStore()
  const {currentUser,isLoading,fetchUserInfo} = useUserStore()
  useEffect(()=>{
    const sub = onAuthStateChanged(auth,(user)=>{
      fetchUserInfo(user?.uid)

    })

  },[fetchUserInfo])

  console.log(currentUser)

  if (isLoading){
    return <div className="loading">Loading...</div>
  }
  return (
    
    <div className='container'>
      {
      currentUser ? (
          <>
            <List/>

            {chatId && <Chat/>}
            {chatId && <Details/>}
          </>
          
        ) : (<Login/>)
      }

      <Notification/>
    </div>
  )
}

export default App