import { Button, Flex, Text ,Box} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UpdateProfilePage from '../update/UpdateProfilePage'
import useShowtoast from '../../hooks/useShowtoast'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import FirstTimeUser from '../../atoms/FirstTimeUSer'
import userAtom from '../../atoms/userAtom'
import useGetUserProfile from '../../hooks/useGetUserProfile'
import PostsAtom from '../../atoms/PostsAtom'
import UserPost from '../UserPosts/UserPost'
import {ColorRing} from "react-loader-spinner"

const Homepage = () => {
  const[posts,setPosts]=useRecoilState(PostsAtom)
  const[loading,setLoading]=useState(false)
  const navigate = useNavigate();
  const showToast=useShowtoast()

  const [isFirstTimeuser,setisFirstTimeuser]=useRecoilState(FirstTimeUser)
const currentUser=useRecoilValue(userAtom)
console.log(currentUser);




  
  const handleVisitProfile = () => {
    if (currentUser?.username) {
      navigate(`/${currentUser.username}`);
    } else {
      console.log("User data is missing");
    }}



  useEffect(()=>{
    if(isFirstTimeuser){
      showToast("Info!", "Update Your Profile photo to help people recognize you");
    }
      
    
    
  },[isFirstTimeuser,showToast,setisFirstTimeuser])


  console.log(currentUser);
  useEffect(()=>{
    const getFeedposts=async()=>{
      setLoading(true);
      setPosts([])
      try {
        const res=await fetch("/api/posts/feed");
        const data=await res.json()
        if(data.error){
          showToast("Error",data.error,"error")
          return
        }
        setPosts(data)
      } catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
    getFeedposts()
  },[showToast,setPosts])
  
  return (
    <>
   
 <Flex justifyContent={'center'} w={'full'} flexDirection={'column'}>

    {/* <Button  mx={'auto'} my={'auto'}fontSize={'sm'} onClick={handleVisitProfile}> visit ur profile</Button> */}


    <Box flex={70}>
				{!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}
     

				{loading && (
					<Flex justify='center'>
						<ColorRing
  visible={true}
  height="50"
  width="50"
  ariaLabel="color-ring-loading"
  wrapperStyle={{}}
  wrapperClass="color-ring-wrapper"
  colors={['#e03541', '#218ccf', '#d7ea27', '#342aff', '#849b87']}

  />
					</Flex>
				)}
        {
          posts.map((post)=>(
            <UserPost key={post._id}  post={post} postedBy={post.postedBy}/>
          ))
        }
        </Box>


 </Flex>
 
{isFirstTimeuser&&<UpdateProfilePage/>}
    </>
  )
}


export default Homepage
