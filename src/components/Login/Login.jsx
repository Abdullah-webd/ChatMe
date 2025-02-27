import React from 'react'
import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import uploadImageAndGetURL from '../../lib/supabase'
import { collection } from 'firebase/firestore'
import { query } from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';
import { where } from 'firebase/firestore';
const Login = () => {
    const [loading,setLoading] = useState(false)

    const [avatar,setAvatar] = useState({
        file:null,
        url:''
    })
    const handleAvatar = (e) => {
        if (e.target.files[0]){
            setAvatar({
                file: e.target.files[0],
                url:URL.createObjectURL(e.target.files[0])
            })
        }
        
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const formdata = new FormData(e.target);
        const {email,password} = Object.fromEntries(formdata)
        try {
            setLoading(true)
            await signInWithEmailAndPassword(auth,email,password)
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            

        }finally{
            setLoading(false)
        }
    }


    const handleRegister = async (e) => {
        
        e.preventDefault()
        setLoading(true)
        const formdata = new FormData(e.target);
        const {username,email,password} = Object.fromEntries(formdata)

        // VALIDATE INPUTS
        if (!username || !email || !password)
            return toast.warn("Please enter inputs!");
        if (!avatar.file) return toast.warn("Please upload an avatar!");
    
        // VALIDATE UNIQUE USERNAME
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return toast.warn("Select another username");
        }

        const imgurl = await uploadImageAndGetURL(avatar.file)

        try {
            const res = await createUserWithEmailAndPassword(auth,email,password);
            await setDoc(
                doc(db,'users',res.user.uid),{
                    username,
                    email,
                    id:res.user.uid,
                    avatars:imgurl,
                    blocked:[]
                }
            )

            await setDoc(doc(db,"userchats",res.user.uid),{
                chats:[],
            })
            toast.success("Account created successfully")
        } catch (error) {
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
        

    }
  return (
    <div className='login'>
        <div className="item">
            <h1>Welcome Back,</h1>
            <form onSubmit={(e)=>handleLogin(e)}>
                <input type="email" name='email'placeholder='Email' />
                <input type="password" name='password' placeholder='Password'/>
                <button disabled={loading}>{loading ? 'loading' : 'Sign In'}</button>
            </form>
        </div>
        <div className="seperator"></div>
        <div className="item">
        <h1>Create an Account</h1>
            <form onSubmit={(e)=>handleRegister(e)}>
                <label htmlFor="file"><img src={avatar.url || './avatar.png'} alt="" />Upload an Image</label>
                <input type="file" id='file' placeholder='Upload Your picture' style={{display:'none'}} onChange={(e)=>handleAvatar(e)}/>
                <input type="email" name='email'placeholder='Email' />
                <input type="password" name='password' placeholder='Password'/>
                <input type="text" name='username' placeholder='Username'/>
                
                <button disabled={loading}>{loading? 'loading' : 'Sign Up'}</button>
            </form>
        </div>
    </div>
  )
}

export default Login