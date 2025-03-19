// import { List } from "./components/list/list"
import { Chat } from "./components/chat/Chat"
import { Details } from "./components/details/Details"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react"
import Login from "./components/Login/Login"
import Notification from "./components/Notification/notification"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase"
import { useUserStore } from "./lib/userstore"
import { useChatStore } from "./lib/chatstore"
import { List } from "./components/list/Liist"
import VideoCall from "./components/videocall/VideoCall"
import { useState } from "react"
const App = () => {
  const [show,setShow] = useState(true)
  const user = false
  const {chatId} = useChatStore()
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
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
    
    <Router>
      <Routes>
        {/* Route for VideoCall component */}
        <Route path="/videocall" element={<VideoCall />} />

        {/* Main authenticated app routes */}
        <Route
          path="/"
          element={
            currentUser ? (
              <div className="container">
                {isLargeScreen ? (
                  <>
                    <List toggle={() => setShow(false)} />
                    {chatId && <Chat toggle={() => setShow(true)} />}
                    {chatId && <Details />}
                  </>
                ) : (
                  <>
                    {show ? (
                      <List toggle={() => setShow(false)} />
                    ) : (
                      <>
                        {chatId && <Chat toggle={() => setShow(true)} />}
                        {chatId && <Details />}
                      </>
                    )}
                  </>
                )}
                <Notification />
              </div>
            ) : (
              <Login />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App