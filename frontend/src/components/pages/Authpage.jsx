import React, { useState } from 'react'
import Signup from '../Auth/Signup'
import Login from '../Auth/Login'
import { useRecoilState, useRecoilValue } from 'recoil'
import authScreenAtom from '../../atoms/authAtoms'

const Authpage = () => {
    const authScreenStatevalue=useRecoilValue(authScreenAtom)
    // const[value,setValue]=useState('login')
    console.log(authScreenStatevalue);
    
  return (
   <>
   {authScreenStatevalue==='login'?<Login/>:<Signup/>}
   </>
  )
}

export default Authpage
