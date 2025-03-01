import React, { useEffect } from "react";
import { useState } from "react";
import "./chatlist.css";
import AddUser from "../../AddUSer/AddUser";
import { useUserStore } from "../../../lib/userstore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatstore";
const 
ChatList = ({toggle}) => {
  const [chats, setChats] = useState([]);
  const [addmode, setAdMode] = useState(false);
  const [input , setInput] = useState('');

  const currentUser = useUserStore.getState().currentUser;
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    const onSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.recieverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();
          return { ...item, user };
        });
        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      onSub();
    };
  }, [currentUser.id]);

  console.log(chats);
  const handleSelect = async (chat) => {
    const userChatRef = doc(db, "userchats", currentUser.id);
    const userChatsSnapshot = await getDoc(userChatRef);

    if (userChatsSnapshot.exists()) {
      const userChatsData = userChatsSnapshot.data();

      const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chat.chatId);



      userChatsData.chats[chatIndex].isSeen = true
      

      await updateDoc(doc(db, "userchats", currentUser.id), {
        chats: userChatsData.chats,
      });
    }

    changeChat(chat.chatId, chat.user);
  };

  const filteredChats = chats.filter((c)=> c.user.username.toLowerCase().includes(input.toLowerCase()))

  return (
    <div className="chatlist">
      <div className="search">
        <div className="searchbar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="Search"  onChange={(e)=>setInput(e.target.value)} />
        </div>
        <img
          src={addmode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => setAdMode((prev) => !prev)}
        />
      </div>
      <div onClick={() => window.innerWidth <= 768 && toggle()}>
          {filteredChats.map((chat) => (
            <div
              className="item"
              key={chat.chatId}
              onClick={() => handleSelect(chat)}
              style={{
                backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
              }}
            >
              <img src={chat.user.blocked.includes(currentUser.id) ?'./avatar.png' : chat.user.avatars || "./avatar.png"} alt="" />
              <div className="texts">
                <span>{chat.user.blocked.includes(currentUser.id) ? 'User' : chat.user.username}</span>
                <p>{chat.lastMessage}</p>
              </div>
            </div>
          ))}
      </div>
      

      {addmode && <AddUser />}
    </div>
  );
};

export default ChatList;
