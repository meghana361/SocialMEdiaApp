import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import useShowtoast from './useShowtoast';
import { useParams } from 'react-router-dom';
const useGetUserProfile = () => {
    const[user,setUser]=useState(null)
    const [loading, setLoading] = useState(true);
	const { username } = useParams();
	const showToast = useShowtoast();
    useEffect(()=>{
        const getUser=async()=>{
try {
    const res=await fetch(`/api/users/getUserProfile/${username}`)
    const data=await res.json();
    if (data.error) {
        showToast("Error", data.error, "error");
        return;
    }
    console.log(data);
    
    setUser(data);
} catch (error) {
    showToast("Error", error.message, "error");
} finally {
    setLoading(false);

        }
    }
        getUser();
	},[username, showToast]);
    return { loading, user };
}



export default useGetUserProfile
// useCallback(()=>{

// },[])